# 🚀 Student Nexus - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

The core engine of **Student Nexus**, a robust and scalable RESTful API built with Node.js, Express, and TypeScript. It handles everything from real-time communication to AI-powered discovery.
-------

## 🌟 Key Features

- **🔐 Secure Auth**: JWT-based authentication with Access & Refresh token rotation.
- **👥 Multi-Role Profiles**: Specialized data structures for Students, Alumni, and Teachers.
- **💬 Real-time Messaging**: Instant chat powered by Socket.io and Redis adapter.
- **📱 Social Engine**: Dynamic feed with post interactions (likes/comments).
- **🤖 AI Integration**: Integrated with OpenAI for smart search and assistance.
- **📁 Media Management**: Optimized image processing via Cloudinary and Sharp.

---

## 🏗️ Project Architecture

The backend follows a clean **Controller-Service-Model** pattern:

```text
student-nexus-backend/
├── src/
│   ├── controllers/    # Request handling & Response formatting
│   ├── services/       # Core business logic (The brain)
│   ├── models/         # Mongoose schemas & Database definitions
│   ├── routes/         # API endpoint definitions (v1 & Master)
│   ├── sockets/        # Real-time event handlers
│   ├── middlewares/    # Security, Validation & Error handling
│   ├── core/           # JWT, Cookies & Shared utilities
│   └── utils/          # Helper functions (Cloudinary, Email, etc.)
├── uploads/            # Local temporary file storage
└── docker-compose.yml  # Infrastructure (Redis, Mongo)
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis (For socket scalability)

### Quick Start
1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment**
   Create a `.env` file based on the environment requirements (JWT secrets, DB URI, Cloudinary keys).
4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Implementation
- **Password Hashing**: Bcrypt with 10 salt rounds.
- **JWT**: HTTP-only cookies for secure token storage.
- **CORS**: Restricted origins for frontend security.
- **RBAC**: Role-Based Access Control on critical endpoints.

---

## 📡 Core API Modules

| Module | Endpoint Prefix | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | Login, Register, Profile Management |
| **Students** | `/api/v1/students` | Academic details & Student directory |
| **Feed** | `/api/v1/feeds` | Social posts, Likes, and Comments |
| **Chat** | `/api/v1/chat` | Messaging and Conversation history |
| **University** | `/api/v1/university` | Institution & Course management |

---

## 🚀 Deployment
The project is containerized using **Docker**, making it easy to deploy in any cloud environment.

```bash
docker-compose up -d
```

---

Developed with ❤️ for the student community.
