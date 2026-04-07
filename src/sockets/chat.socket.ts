import { Server, Socket } from "socket.io";
import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export const chatSocketHandler = (io: Server, socket: Socket) => {
  const user = (socket as any).user;

  // ----- JOIN CHAT -----
  socket.on("join_chat", (room: string) => {
    socket.join(room);
    console.log(`User ${user.firstName} joined room: ${room}`);
  });


  // ----- SEND MESSAGE -----
  socket.on("new_message", async (data: { chatId: string; content: string; messageType?: string; attachments?: any[] }) => {
    try {
      const { chatId, content, messageType, attachments } = data;
      
      // Save to database
      const message = await chatService.sendMessage(user._id, chatId, content, messageType, attachments);
      
      // Emit to all users in the chat room
      // We use 'to(chatId)' to target the room
      io.to(chatId).emit("message_received", message);
      
      // Also emit update to participants' personal rooms for conversation list updates
      if (message.chat && message.chat.users) {
        message.chat.users.forEach((u: any) => {
          if (u._id.toString() === user._id.toString()) return;
          io.to(u._id.toString()).emit("message_received_notification", message);
        });
      }
    } catch (error) {
      socket.emit("error_message", { message: "Failed to send message" });
    }
  });


  // ----- TYPING INDICATORS -----
  socket.on("typing", (room: string) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop_typing", (room: string) => {
    socket.in(room).emit("stop_typing", room);
  });


  // ----- MESSAGE SEEN / READ RECEIPT -----
  socket.on("message_seen", async (data: { messageId: string; chatId: string }) => {
    try {
      // Logic to update database 'readBy' can be added here if needed
      socket.in(data.chatId).emit("message_seen", data);
    } catch (error) {
      console.error("Error handling message_seen:", error);
    }
  });

  console.log(`Chat handlers registered for user: ${user.firstName}`);
};
