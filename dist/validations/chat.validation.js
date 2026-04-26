"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessagesSchema = exports.sendMessageSchema = exports.createGroupChatSchema = exports.accessChatSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const isObjectId = (val) => mongoose_1.Types.ObjectId.isValid(val);
const objectId = zod_1.z.string().refine(isObjectId, { message: "Invalid ID format" });
// ----- ACCESS / CREATE 1:1 CHAT -----
exports.accessChatSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: objectId,
    }),
});
// ----- CREATE GROUP CHAT -----
exports.createGroupChatSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Group name cannot be empty" })
            .max(100, { message: "Group name must be at most 100 characters" }),
        users: zod_1.z
            .array(objectId)
            .min(2, { message: "At least 2 users are required to form a group" }),
    }),
});
// ----- SEND MESSAGE (REST) -----
exports.sendMessageSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        chatId: objectId,
        content: zod_1.z
            .string()
            .trim()
            .optional(),
        messageType: zod_1.z
            .enum(["text", "image", "video", "file"])
            .default("text")
            .optional(),
        attachments: zod_1.z.union([
            zod_1.z.array(zod_1.z.object({
                url: zod_1.z.string().url({ message: "Attachment URL must be a valid URL" }),
                fileType: zod_1.z.string().min(1, { message: "File type is required" }),
                size: zod_1.z.number().positive({ message: "Attachment size must be positive" }),
            })),
            zod_1.z.string() // In case it's stringified JSON from FormData
        ]).optional(),
    }),
});
// ----- FETCH MESSAGES -----
exports.fetchMessagesSchema = zod_1.z.object({
    params: zod_1.z.object({
        chatId: objectId,
    }),
});
