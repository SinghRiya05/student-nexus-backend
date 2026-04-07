import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { catchAsync } from "../core/catchAsync";
import { sendSuccessResponse, sendCreatedResponse } from "../core/responses";

const chatService = new ChatService();

export class ChatController {
  /**
   * Access or create a 1:1 chat
   */
  accessChat = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;
    const currentUserId = (req as any).user._id;

    const chat = await chatService.accessChat(currentUserId, userId);
    return sendSuccessResponse(res, chat, "Chat accessed successfully");
  });

  /**
   * Fetch all chats for the logged in user
   */
  fetchChats = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const chats = await chatService.fetchChats(userId);
    return sendSuccessResponse(res, chats, "Chats fetched successfully");
  });

  /**
   * Create a group chat
   */
  createGroupChat = catchAsync(async (req: Request, res: Response) => {
    const { users, name } = req.body;
    const adminId = (req as any).user._id;

    const groupChat = await chatService.createGroupChat(name, users, adminId);
    return sendCreatedResponse(res, groupChat, "Group chat created successfully");
  });

  /**
   * Fetch messages for a specific chat
   */
  fetchMessages = catchAsync(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const messages = await chatService.fetchMessages(chatId as string);
    return sendSuccessResponse(res, messages, "Messages fetched successfully");
  });

  /**
   * Send a message via REST API (Alternative to Socket)
   */
  sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { chatId, content, messageType, attachments } = req.body;
    const senderId = (req as any).user._id;

    const message = await chatService.sendMessage(senderId, chatId as string, content, messageType, attachments);
    return sendCreatedResponse(res, message, "Message sent successfully");
  });
}
