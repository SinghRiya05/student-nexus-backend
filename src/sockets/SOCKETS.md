# Socket Architecture Documentation

This document explains the real-time communication layer of the Student Nexus backend, built on **Socket.io**, **WebRTC signaling**, and **Redis Pub/Sub**.

---

## Table of Contents

1. [socket.init.ts — Core Initialization](#1-socketinits--core-initialization)
2. [chat.socket.ts — Real-Time Messaging](#2-chatsocketts--real-time-messaging)
3. [call.socket.ts — Video / Audio / Screen Sharing](#3-callsocketts--video--audio--screen-sharing)
4. [Socket Event Reference Table](#4-socket-event-reference-table)
5. [End-to-End Flow Diagrams](#5-end-to-end-flow-diagrams)

---

## 1. `socket.init.ts` — Core Initialization

**File:** `src/sockets/socket.init.ts`

This is the **entry point** for all real-time communication. It is called once at server startup in `server.ts`.

### `setupSocket(server)`

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `server` | `http.Server` | The Node.js HTTP server created in `server.ts` |

**Returns:** `io` — the initialized `Server` instance from Socket.io.

**What it does:**

#### Step 1 — CORS Configuration
Reads `CORS_ORIGINS` from the `.env` file and allows only those origins to open WebSocket connections. Requests with no `Origin` header (Postman, mobile apps, `file://` pages) are also allowed.

```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000
```

#### Step 2 — Redis Adapter (Scaling)
Attempts to connect to Redis and attach the `@socket.io/redis-adapter`. This enables horizontal scaling — users connected to different server instances can still communicate through the shared Redis Pub/Sub bus.

If Redis is unavailable, it falls back silently to the **in-memory adapter** (single-server mode). The server does **not** crash.

#### Step 3 — JWT Authentication Middleware
Every incoming socket connection must pass a valid JWT token. The token is read from:
- `socket.handshake.auth.token` ← preferred (sent by the client as `{ auth: { token } }`)
- `socket.handshake.headers.authorization` ← fallback (Bearer token in headers)

The middleware verifies the token using `verifyAccessToken()`, fetches the user from MongoDB, and attaches it to `socket.user`. If verification fails, the connection is rejected with an error.

```
Client ---[JWT Token]---> Server
                           ↓
                    verifyAccessToken()
                           ↓
                    userModel.findById()
                           ↓
                    socket.user = user ✅
```

#### Step 4 — Connection Handling
On successful connection:
1. The user **joins their personal room** using their MongoDB `_id` (e.g., `socket.join("69d436008fb2b4bd209e1528")`). This allows any server to send private messages/notifications directly to this user by targeting their ID.
2. **Chat handlers** are registered via `chatSocketHandler()`.
3. **Call handlers** are registered via `callSocketHandler()`.

---

## 2. `chat.socket.ts` — Real-Time Messaging

**File:** `src/sockets/chat.socket.ts`

Handles all real-time messaging events. Registered per-connection in `socket.init.ts`.

### `chatSocketHandler(io, socket)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `io` | `Server` | The global Socket.io server instance |
| `socket` | `Socket` | The individual client's socket connection |

---

### Events Handled (Incoming from Client)

#### `join_chat`
```typescript
socket.on("join_chat", (room: string) => { ... })
```
**Purpose:** Adds the client to a specific chat room (identified by the chat's MongoDB `_id`).  
**Effect:** The user will now receive all `message_received` events emitted to that room.  
**When to call:** When the user opens a conversation/chat window.

```
Client emits → join_chat("chatId123")
Server → socket.join("chatId123")
```

---

#### `new_message`
```typescript
socket.on("new_message", async (data: { chatId, content, messageType?, attachments? }) => { ... })
```
**Purpose:** Sends a new message in a chat room.

**Flow:**
1. Saves the message to MongoDB via `ChatService.sendMessage()`.
2. Emits `message_received` to **all users** in the chat room (including the sender).
3. Emits `message_received_notification` to each participant's **personal room** for conversation list updates (even if they're not currently in that chat).

**Payload:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chatId` | `string` | ✅ | MongoDB `_id` of the chat |
| `content` | `string` | ⚠️ | Text content (required if no attachments) |
| `messageType` | `"text" \| "image" \| "video" \| "file"` | ❌ | Defaults to `"text"` |
| `attachments` | `Array<{ url, fileType, size }>` | ❌ | File attachments |

---

#### `typing`
```typescript
socket.on("typing", (room: string) => { ... })
```
**Purpose:** Broadcasts a typing indicator to all **other** users in the room.  
**Effect:** Emits `typing` event to everyone in `room` except the sender.

---

#### `stop_typing`
```typescript
socket.on("stop_typing", (room: string) => { ... })
```
**Purpose:** Removes the typing indicator.  
**Effect:** Emits `stop_typing` to everyone in the room except the sender.

---

#### `message_seen`
```typescript
socket.on("message_seen", async (data: { messageId: string; chatId: string }) => { ... })
```
**Purpose:** Marks a message as read and notifies the sender.  
**Effect:** Emits `message_seen` to all other users in the chat room.  
**Note:** Database `readBy` update can be added here when needed.

---

### Events Emitted (Server → Client)

| Event | Target | Payload | Description |
|-------|--------|---------|-------------|
| `message_received` | Chat room | Full message object | New message for all room members |
| `message_received_notification` | Personal room | Full message object | Background notification for conversation list |
| `typing` | Chat room | `room: string` | Someone started typing |
| `stop_typing` | Chat room | `room: string` | Someone stopped typing |
| `message_seen` | Chat room | `{ messageId, chatId }` | A message was read |

---

## 3. `call.socket.ts` — Video / Audio / Screen Sharing

**File:** `src/sockets/call.socket.ts`

Implements a **WebRTC signaling server**. It does not transmit video/audio directly — it relays the connection negotiation data (offers, answers, ICE candidates) between peers so they can establish a **direct peer-to-peer connection** for media.

### `callSocketHandler(io, socket)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `io` | `Server` | The global Socket.io server instance |
| `socket` | `Socket` | The individual client's socket connection |

---

### Events Handled (Incoming from Client)

#### `call_user`
```typescript
socket.on("call_user", (data: { userToCall, signalData, from, name, type }) => { ... })
```
**Purpose:** Initiates a call to another user.  
**How it works:** Relays the WebRTC **SDP Offer** to the target user's personal room.

**Payload:**
| Field | Type | Description |
|-------|------|-------------|
| `userToCall` | `string` | Target user's MongoDB `_id` |
| `signalData` | `RTCSessionDescriptionInit` | WebRTC SDP offer |
| `from` | `string` | Caller's socket ID |
| `name` | `string` | Caller's display name |
| `type` | `"video" \| "voice"` | Type of call |

---

#### `answer_call`
```typescript
socket.on("answer_call", (data: { to: string; signal: any }) => { ... })
```
**Purpose:** Accepts an incoming call.  
**How it works:** Relays the WebRTC **SDP Answer** back to the caller's personal room.

**Payload:**
| Field | Type | Description |
|-------|------|-------------|
| `to` | `string` | Caller's socket ID (`from` from `call_user`) |
| `signal` | `RTCSessionDescriptionInit` | WebRTC SDP answer |

---

#### `end_call`
```typescript
socket.on("end_call", (data: { to: string }) => { ... })
```
**Purpose:** Ends or rejects an active/incoming call.  
**How it works:** Emits `call_ended` to the other party's personal room so their UI can clean up.

---

#### `screen_share_toggle`
```typescript
socket.on("screen_share_toggle", (data: { to: string; isSharing: boolean }) => { ... })
```
**Purpose:** Notifies the remote peer when screen sharing starts or stops.  
**How it works:** Emits `screen_share_status` to the target user.  
**Note:** The actual screen video track is replaced inside the WebRTC `RTCPeerConnection` on the client — this event only signals the **status change**.

---

#### `ice_candidate`
```typescript
socket.on("ice_candidate", (data: { to: string; candidate: any }) => { ... })
```
**Purpose:** Relays WebRTC **ICE candidates** between peers during connection establishment.  
**Why it's needed:** WebRTC peers each discover multiple network paths (local IP, peer-reflexive, relay). These candidates must be exchanged for NAT traversal and to establish a stable connection.  
**How it works:** Forwards the `RTCIceCandidate` object to the target user's personal room.

---

### Events Emitted (Server → Client)

| Event | Target | Payload | Description |
|-------|--------|---------|-------------|
| `call_user` | Personal room | `{ signal, from, name, type }` | Incoming call notification |
| `call_accepted` | Personal room | `RTCSessionDescription` | Remote peer accepted the call |
| `call_ended` | Personal room | _(none)_ | Remote peer ended/rejected the call |
| `screen_share_status` | Personal room | `{ isSharing: boolean }` | Screen share started/stopped |
| `ice_candidate` | Personal room | `RTCIceCandidate` | Network candidate for WebRTC |

---

## 4. Socket Event Reference Table

### Client → Server Events

| Event | File | Description |
|-------|------|-------------|
| `join_chat` | chat.socket.ts | Join a chat room |
| `new_message` | chat.socket.ts | Send a text/media message |
| `typing` | chat.socket.ts | Start typing indicator |
| `stop_typing` | chat.socket.ts | Stop typing indicator |
| `message_seen` | chat.socket.ts | Mark message as read |
| `call_user` | call.socket.ts | Initiate a video/voice call |
| `answer_call` | call.socket.ts | Accept an incoming call |
| `end_call` | call.socket.ts | End/reject a call |
| `screen_share_toggle` | call.socket.ts | Toggle screen sharing |
| `ice_candidate` | call.socket.ts | Exchange ICE candidate |

### Server → Client Events

| Event | File | Description |
|-------|------|-------------|
| `message_received` | chat.socket.ts | New message in room |
| `message_received_notification` | chat.socket.ts | Background chat notification |
| `typing` | chat.socket.ts | Someone is typing |
| `stop_typing` | chat.socket.ts | Someone stopped typing |
| `message_seen` | chat.socket.ts | Message was read |
| `call_user` | call.socket.ts | Incoming call |
| `call_accepted` | call.socket.ts | Call accepted |
| `call_ended` | call.socket.ts | Call ended |
| `screen_share_status` | call.socket.ts | Screen share status changed |
| `ice_candidate` | call.socket.ts | ICE candidate from peer |

---

## 5. End-to-End Flow Diagrams

### Chat Message Flow

```
User A                     Server                     User B
  |                           |                           |
  |-- join_chat(chatId) ----> |                           |
  |                           |                           |
  |-- new_message(data) ----> |                           |
  |                           |-- message_received -----> |  (in chat room)
  |<-- message_received ----- |                           |
  |                           |-- message_received -----> |  (personal room notif)
  |                           |     _notification         |
```

### Video Call Flow

```
User A (Caller)            Server (Relay)            User B (Receiver)
  |                           |                           |
  |-- call_user(offer) -----> |                           |
  |                           |-- call_user(offer) -----> |
  |                           |                           |-- [User accepts]
  |                           |<-- answer_call(answer) -- |
  |<-- call_accepted(answer)--|                           |
  |                           |                           |
  |-- ice_candidate --------> |-- ice_candidate --------> |
  |<-------- ice_candidate -- |<-- ice_candidate -------- |
  |                           |                           |
  |========= Direct P2P WebRTC Stream (no server) ========|
```

### Screen Sharing Flow

```
User A                     Server                     User B
  |                           |                           |
  |  [replaces video track    |                           |
  |   in WebRTC locally]      |                           |
  |-- screen_share_toggle --> |                           |
  |   { isSharing: true }     |-- screen_share_status --> |
  |                           |                           |-- [UI shows "sharing"]
  |                           |                           |
  |== Screen data via P2P WebRTC track (no server) ======>|
```

> **Note:** The server only relays **signaling data** (offers, answers, ICE candidates, status). All actual **audio, video, and screen data** flows directly between the two clients via WebRTC (peer-to-peer).
