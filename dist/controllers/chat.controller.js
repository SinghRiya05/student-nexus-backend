"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const catchAsync_1 = require("../core/catchAsync");
const responses_1 = require("../core/responses");
const ApiError_1 = require("../core/ApiError");
const chatService = new chat_service_1.ChatService();
class ChatController {
    constructor() {
        // ----- ACCESS OR CREATE CHAT -----
        this.accessChat = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { userId } = req.body;
            const currentUserId = req.user._id;
            const chat = await chatService.accessChat(currentUserId, userId);
            return (0, responses_1.sendSuccessResponse)(res, chat, "Chat accessed successfully");
        });
        // ----- FETCH ALL CHATS -----
        this.fetchChats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id;
            const chats = await chatService.fetchChats(userId);
            return (0, responses_1.sendSuccessResponse)(res, chats, "Chats fetched successfully");
        });
        // ----- CREATE GROUP CHAT -----
        this.createGroupChat = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { users, name } = req.body;
            const adminId = req.user._id;
            const groupChat = await chatService.createGroupChat(name, users, adminId);
            return (0, responses_1.sendCreatedResponse)(res, groupChat, "Group chat created successfully");
        });
        // ----- FETCH MESSAGES -----
        this.fetchMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { chatId } = req.params;
            const messages = await chatService.fetchMessages(chatId);
            return (0, responses_1.sendSuccessResponse)(res, messages, "Messages fetched successfully");
        });
        // ----- SEND MESSAGE -----
        this.sendMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
            let { chatId, content, messageType, attachments } = req.body;
            const senderId = req.user._id;
            // Handle files from multer
            const files = req.files;
            let processedAttachments = [];
            if (files && files.length > 5) {
                throw new ApiError_1.ApiError("You can only attach up to 5 files", 400);
            }
            if (files && files.length > 0) {
                processedAttachments = files.map((file) => ({
                    url: `/uploads/chat/${file.filename}`,
                    fileType: file.mimetype,
                    size: file.size,
                }));
                // Auto-set message type if not provided
                if (!messageType || messageType === "text") {
                    const isImage = files.every(f => f.mimetype.startsWith("image/"));
                    messageType = isImage ? "image" : "file";
                }
            }
            // Handle JSON stringified attachments in body (if any)
            if (attachments && typeof attachments === "string") {
                try {
                    const parsed = JSON.parse(attachments);
                    if (Array.isArray(parsed)) {
                        processedAttachments = [...processedAttachments, ...parsed];
                    }
                }
                catch (e) {
                    // Ignore parsing error, use existing attachments if valid
                }
            }
            else if (Array.isArray(attachments)) {
                processedAttachments = [...processedAttachments, ...attachments];
            }
            const message = await chatService.sendMessage(senderId, chatId, content, messageType || "text", processedAttachments);
            // Emit socket event for real-time delivery
            const io = req.app.get("io");
            if (io) {
                io.to(chatId).emit("message_received", message);
                if (message.chat && message.chat.users) {
                    message.chat.users.forEach((u) => {
                        if (u._id.toString() === senderId.toString())
                            return;
                        io.to(u._id.toString()).emit("message_received_notification", message);
                    });
                }
            }
            return (0, responses_1.sendCreatedResponse)(res, message, "Message sent successfully");
        });
        // ----- CLEAR CHAT -----
        this.clearChat = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { chatId } = req.params;
            await chatService.clearChat(chatId);
            return (0, responses_1.sendSuccessResponse)(res, null, "Chat cleared successfully");
        });
        // ----- DELETE CONVERSATION -----
        this.deleteChat = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { chatId } = req.params;
            await chatService.deleteChat(chatId);
            return (0, responses_1.sendSuccessResponse)(res, null, "Chat deleted successfully");
        });
    }
}
exports.ChatController = ChatController;
