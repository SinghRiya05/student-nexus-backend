"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const user_model_1 = require("../models/user.model");
const chat_model_1 = require("../models/chat.model");
const message_model_1 = require("../models/message.model");
const ApiError_1 = require("../core/ApiError");
class ChatService {
    // ----- ACCESS OR CREATE CHAT -----
    async accessChat(currentUserId, targetUserId) {
        // Find 1:1 chat between these two users
        let isChat = await chat_model_1.chatModel.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: currentUserId } } },
                { users: { $elemMatch: { $eq: targetUserId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");
        isChat = await user_model_1.userModel.populate(isChat, {
            path: "latestMessage.sender",
            select: "firstName lastName avatar email",
        });
        if (isChat.length > 0) {
            return isChat[0];
        }
        else {
            // Create new 1:1 chat
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [currentUserId, targetUserId],
            };
            try {
                const createdChat = await chat_model_1.chatModel.create(chatData);
                const fullChat = await chat_model_1.chatModel
                    .findOne({ _id: createdChat._id })
                    .populate("users", "-password");
                return fullChat;
            }
            catch (error) {
                throw new ApiError_1.ApiError(error.message, 400);
            }
        }
    }
    // ----- CREATE GROUP CHAT -----
    async createGroupChat(name, users, adminId) {
        if (!users || !name) {
            throw new ApiError_1.ApiError("Please fill all the fields", 400);
        }
        if (users.length < 2) {
            throw new ApiError_1.ApiError("More than 2 users are required to form a group chat", 400);
        }
        users.push(adminId);
        try {
            const groupChat = await chat_model_1.chatModel.create({
                chatName: name,
                users: users,
                isGroupChat: true,
                groupAdmin: adminId,
            });
            const fullGroupChat = await chat_model_1.chatModel
                .findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            return fullGroupChat;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // ----- SEND MESSAGE -----
    async sendMessage(senderId, chatId, content, messageType = "text", attachments = []) {
        if (!content && attachments.length === 0) {
            throw new ApiError_1.ApiError("Invalid data passed into request", 400);
        }
        const newMessage = {
            sender: senderId,
            content: content,
            chat: chatId,
            messageType,
            attachments,
        };
        try {
            let message = await message_model_1.messageModel.create(newMessage);
            message = await message.populate("sender", "firstName lastName avatar");
            message = await message.populate("chat");
            message = await user_model_1.userModel.populate(message, {
                path: "chat.users",
                select: "firstName lastName avatar email",
            });
            // Update latest message in chat
            await chat_model_1.chatModel.findByIdAndUpdate(chatId, {
                latestMessage: message,
                lastActivity: Date.now(),
            });
            return message;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // ----- FETCH CHATS -----
    async fetchChats(userId) {
        try {
            const results = await chat_model_1.chatModel
                .find({ users: { $elemMatch: { $eq: userId } } })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                .sort({ lastActivity: -1 });
            const finalResults = await user_model_1.userModel.populate(results, {
                path: "latestMessage.sender",
                select: "firstName lastName avatar email",
            });
            return finalResults;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // ----- FETCH MESSAGES -----
    async fetchMessages(chatId) {
        try {
            const messages = await message_model_1.messageModel
                .find({ chat: chatId })
                .populate("sender", "firstName lastName avatar email")
                .populate("chat")
                .sort({ createdAt: 1 });
            return messages;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // ----- MARK CHAT AS READ (BULK) -----
    async markChatAsRead(userId, chatId) {
        try {
            const result = await message_model_1.messageModel.updateMany({
                chat: chatId,
                sender: { $ne: userId },
                readBy: { $ne: userId }
            }, { $addToSet: { readBy: userId } });
            return result;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // --- CLEAR CHAT (DELETE MESSAGES) ---
    async clearChat(chatId) {
        try {
            const result = await message_model_1.messageModel.deleteMany({ chat: chatId });
            return result;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
    // ----- DELETE CONVERSATION -----
    async deleteChat(chatId) {
        try {
            // 1. Delete all messages first
            await message_model_1.messageModel.deleteMany({ chat: chatId });
            // 2. Delete the chat document
            const result = await chat_model_1.chatModel.findByIdAndDelete(chatId);
            return result;
        }
        catch (error) {
            throw new ApiError_1.ApiError(error.message, 400);
        }
    }
}
exports.ChatService = ChatService;
