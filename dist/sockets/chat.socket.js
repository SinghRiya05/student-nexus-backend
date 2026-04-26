"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocketHandler = void 0;
const chat_service_1 = require("../services/chat.service");
const chatService = new chat_service_1.ChatService();
const chatSocketHandler = (io, socket) => {
    const user = socket.user;
    // ----- JOIN CHAT -----
    socket.on("join_chat", (room) => {
        socket.join(room);
        console.log(`User ${user.firstName} joined room: ${room}`);
    });
    // ----- SEND MESSAGE -----
    socket.on("new_message", async (data) => {
        try {
            const { chatId, content, messageType, attachments } = data;
            const message = await chatService.sendMessage(user._id, chatId, content, messageType, attachments);
            io.to(chatId).emit("message_received", message);
            if (message.chat && message.chat.users) {
                message.chat.users.forEach((u) => {
                    if (u._id.toString() === user._id.toString())
                        return;
                    io.to(u._id.toString()).emit("message_received_notification", message);
                });
            }
        }
        catch (error) {
            socket.emit("error_message", { message: "Failed to send message" });
        }
    });
    // ----- TYPING INDICATORS -----
    socket.on("typing", (room) => {
        socket.in(room).emit("typing", room);
    });
    socket.on("stop_typing", (room) => {
        socket.in(room).emit("stop_typing", room);
    });
    // ----- MESSAGE SEEN / READ RECEIPT -----
    socket.on("message_seen", async (data) => {
        try {
            const { messageId, chatId } = data;
            // Perform bulk mark as read for this user in this chat
            await chatService.markChatAsRead(user._id, chatId);
            // Emit seen event to others in the room
            socket.in(chatId).emit("message_seen", data);
        }
        catch (error) {
            console.error("Error handling message_seen:", error);
        }
    });
    console.log(`Chat handlers registered for user: ${user.firstName}`);
};
exports.chatSocketHandler = chatSocketHandler;
