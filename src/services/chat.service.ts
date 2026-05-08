import { userModel } from "../models/user.model";
import { chatModel } from "../models/chat.model";
import { messageModel } from "../models/message.model";
import { ApiError } from "../core/ApiError";

export class ChatService {

  // ----- ACCESS OR CREATE CHAT -----
  async accessChat(currentUserId: string, targetUserId: string) {
    // Find 1:1 chat between these two users
    let isChat: any = await chatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: targetUserId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "firstName lastName avatar email",
    });

    if (isChat.length > 0) {
      return isChat[0];
    } else {
      // Create new 1:1 chat
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, targetUserId],
      };

      try {
        const createdChat = await chatModel.create(chatData);
        const fullChat = await chatModel
          .findOne({ _id: createdChat._id })
          .populate("users", "-password");
        return fullChat;
      } catch (error: any) {
        throw new ApiError(error.message, 400);
      }
    }
  }

  // ----- CREATE GROUP CHAT -----
  async createGroupChat(name: string, users: string[], adminId: string) {
    if (!users || !name) {
      throw new ApiError("Please fill all the fields", 400);
    }

    if (users.length < 2) {
      throw new ApiError("More than 2 users are required to form a group chat", 400);
    }

    users.push(adminId);

    try {
      const groupChat = await chatModel.create({
        chatName: name,
        users: users,
        isGroupChat: true,
        groupAdmin: adminId,
      });

      const fullGroupChat = await chatModel
        .findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return fullGroupChat;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }


  // ----- SEND MESSAGE -----
  async sendMessage(senderId: string, chatId: string, content: string, messageType: string = "text", attachments: any[] = []) {
    if (!content && attachments.length === 0) {
      throw new ApiError("Invalid data passed into request", 400);
    }

    const newMessage = {
      sender: senderId,
      content: content,
      chat: chatId,
      messageType,
      attachments,
    };

    try {
      let message: any = await messageModel.create(newMessage);

      message = await message.populate("sender", "firstName lastName avatar");
      message = await message.populate("chat");
      message = await userModel.populate(message, {
        path: "chat.users",
        select: "firstName lastName avatar email",
      });

      // Update latest message in chat
      await chatModel.findByIdAndUpdate(chatId, {
        latestMessage: message,
        lastActivity: Date.now(),
      });

      return message;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }

  // ----- FETCH CHATS -----
  async fetchChats(userId: string) {
    try {
      const results = await chatModel
        .find({ users: { $elemMatch: { $eq: userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ lastActivity: -1 });

      const finalResults = await userModel.populate(results, {
        path: "latestMessage.sender",
        select: "firstName lastName avatar email",
      });

      return finalResults;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }

  // ----- FETCH MESSAGES -----
  // ----- FETCH MESSAGES (WITH PAGINATION) -----
  async fetchMessages(chatId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const messages = await messageModel
        .find({ chat: chatId })
        .populate("sender", "firstName lastName avatar email")
        .populate("chat")
        .sort({ createdAt: -1 }) // Get newest messages first for pagination
        .skip(skip)
        .limit(limit);

      // Return them in chronological order for the UI if it's the first page,
      // but usually the UI handles sorting or we return them as is.
      // Given we are paginating "backwards" in time, newest first is better for the API.
      return messages;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }

  // ----- MARK CHAT AS READ (BULK) -----
  async markChatAsRead(userId: string, chatId: string) {
    try {
      const result = await messageModel.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        },
        { $addToSet: { readBy: userId } }
      );
      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }

  // --- CLEAR CHAT (DELETE MESSAGES) ---
  async clearChat(chatId: string) {
    try {
      const result = await messageModel.deleteMany({ chat: chatId });
      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }

  // ----- DELETE CONVERSATION -----
  async deleteChat(chatId: string) {
    try {
      // 1. Delete all messages first
      await messageModel.deleteMany({ chat: chatId });
      // 2. Delete the chat document
      const result = await chatModel.findByIdAndDelete(chatId);
      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 400);
    }
  }
}
