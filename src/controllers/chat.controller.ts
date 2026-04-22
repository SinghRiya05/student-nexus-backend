import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { catchAsync } from "../core/catchAsync";
import { sendSuccessResponse, sendCreatedResponse } from "../core/responses";

const chatService = new ChatService();

export class ChatController {

  // ----- ACCESS OR CREATE CHAT -----
  accessChat = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;
    const currentUserId = (req as any).user._id;

    const chat = await chatService.accessChat(currentUserId, userId);
    return sendSuccessResponse(res, chat, "Chat accessed successfully");
  });


  // ----- FETCH ALL CHATS -----
  fetchChats = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const chats = await chatService.fetchChats(userId);
    return sendSuccessResponse(res, chats, "Chats fetched successfully");
  });


  // ----- CREATE GROUP CHAT -----
  createGroupChat = catchAsync(async (req: Request, res: Response) => {
    const { users, name } = req.body;
    const adminId = (req as any).user._id;

    const groupChat = await chatService.createGroupChat(name, users, adminId);
    return sendCreatedResponse(res, groupChat, "Group chat created successfully");
  });


  // ----- FETCH MESSAGES -----
  fetchMessages = catchAsync(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const messages = await chatService.fetchMessages(chatId as string);
    return sendSuccessResponse(res, messages, "Messages fetched successfully");
  });


  // ----- SEND MESSAGE -----
  sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { chatId, content, messageType, attachments } = req.body;
    const senderId = (req as any).user._id;

    const message = await chatService.sendMessage(senderId, chatId as string, content, messageType, attachments);
    return sendCreatedResponse(res, message, "Message sent successfully");
  });

  // ----- CLEAR CHAT -----
  clearChat = catchAsync(async (req: Request, res: Response) => {
    const { chatId } = req.params as any;
    await chatService.clearChat(chatId);
    return sendSuccessResponse(res, null, "Chat cleared successfully");
  });

  // ----- DELETE CONVERSATION -----
  deleteChat = catchAsync(async (req: Request, res: Response) => {
    const { chatId } = req.params as any;
    await chatService.deleteChat(chatId);
    return sendSuccessResponse(res, null, "Chat deleted successfully");
  });
}
