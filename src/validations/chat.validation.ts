import { z } from "zod";
import { Types } from "mongoose";

const isObjectId = (val: string) => Types.ObjectId.isValid(val);
const objectId = z.string().refine(isObjectId, { message: "Invalid ID format" });

// ----- ACCESS / CREATE 1:1 CHAT -----
export const accessChatSchema = z.object({
  body: z.object({
    userId: objectId,
  }),
});

// ----- CREATE GROUP CHAT -----
export const createGroupChatSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Group name cannot be empty" })
      .max(100, { message: "Group name must be at most 100 characters" }),
    users: z
      .array(objectId)
      .min(2, { message: "At least 2 users are required to form a group" }),
  }),
});

// ----- SEND MESSAGE (REST) -----
export const sendMessageSchema = z.object({
  body: z
    .object({
      chatId: objectId,
      content: z
        .string()
        .trim()
        .optional(),
      messageType: z
        .enum(["text", "image", "video", "file"])
        .default("text")
        .optional(),
      attachments: z.union([
        z.array(
          z.object({
            url: z.string().url({ message: "Attachment URL must be a valid URL" }),
            fileType: z.string().min(1, { message: "File type is required" }),
            size: z.number().positive({ message: "Attachment size must be positive" }),
          })
        ),
        z.string() // In case it's stringified JSON from FormData
      ]).optional(),
    }),
});

// ----- FETCH MESSAGES -----
export const fetchMessagesSchema = z.object({
  params: z.object({
    chatId: objectId,
  }),
});
