import { Router } from "express";
import { ChatController } from "../../controllers/chat.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  accessChatSchema,
  createGroupChatSchema,
  sendMessageSchema,
  fetchMessagesSchema,
} from "../../validations/chat.validation";
import { uploadChatAttachments } from "../../middlewares/chatAttachment.middleware";

const chatRouter = Router();
const chatController = new ChatController();

// Access or create a 1:1 chat
chatRouter.post("/", validateRequest(accessChatSchema), chatController.accessChat);

// Get all chats for current user (no body — no validation needed)
chatRouter.get("/", chatController.fetchChats);

// Create a group chat
chatRouter.post("/group", validateRequest(createGroupChatSchema), chatController.createGroupChat);

// Get all messages for a chat
chatRouter.get("/messages/:chatId", validateRequest(fetchMessagesSchema), chatController.fetchMessages);

// Send a message via REST
chatRouter.post("/message", uploadChatAttachments, validateRequest(sendMessageSchema), chatController.sendMessage);

// Clear chat messages
chatRouter.delete("/clear/:chatId", chatController.clearChat);

// Delete chat conversation
chatRouter.delete("/:chatId", chatController.deleteChat);

export default chatRouter;
