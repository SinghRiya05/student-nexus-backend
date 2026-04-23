import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { catchAsync } from "../core/catchAsync";
import { sendSuccessResponse, sendCreatedResponse } from "../core/responses";
import { ApiError } from "../core/ApiError";

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
    let { chatId, content, messageType, attachments } = req.body;
    const senderId = (req as any).user._id;

    // Handle files from multer
    const files = req.files as Express.Multer.File[];
    let processedAttachments: any[] = [];

    if (files && files.length > 5) {
      throw new ApiError("You can only attach up to 5 files", 400);
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
      } catch (e) {
        // Ignore parsing error, use existing attachments if valid
      }
    } else if (Array.isArray(attachments)) {
      processedAttachments = [...processedAttachments, ...attachments];
    }

    const message = await chatService.sendMessage(
      senderId,
      chatId as string,
      content,
      messageType || "text",
      processedAttachments
    );

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
