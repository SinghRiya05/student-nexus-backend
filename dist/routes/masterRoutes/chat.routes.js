"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../../controllers/chat.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const chat_validation_1 = require("../../validations/chat.validation");
const chatAttachment_middleware_1 = require("../../middlewares/chatAttachment.middleware");
const chatRouter = (0, express_1.Router)();
const chatController = new chat_controller_1.ChatController();
// Access or create a 1:1 chat
chatRouter.post("/", (0, validateRequest_1.validateRequest)(chat_validation_1.accessChatSchema), chatController.accessChat);
// Get all chats for current user (no body — no validation needed)
chatRouter.get("/", chatController.fetchChats);
// Create a group chat
chatRouter.post("/group", (0, validateRequest_1.validateRequest)(chat_validation_1.createGroupChatSchema), chatController.createGroupChat);
// Get all messages for a chat
chatRouter.get("/messages/:chatId", (0, validateRequest_1.validateRequest)(chat_validation_1.fetchMessagesSchema), chatController.fetchMessages);
// Send a message via REST
chatRouter.post("/message", chatAttachment_middleware_1.uploadChatAttachments, (0, validateRequest_1.validateRequest)(chat_validation_1.sendMessageSchema), chatController.sendMessage);
// Clear chat messages
chatRouter.delete("/clear/:chatId", chatController.clearChat);
// Delete chat conversation
chatRouter.delete("/:chatId", chatController.deleteChat);
exports.default = chatRouter;
