"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: mongoose_1.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true,
    },
    content: {
        type: String,
        trim: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text",
    },
    attachments: [
        {
            url: String,
            fileType: String,
            size: Number,
        },
    ],
    readBy: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    deliveredTo: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Important index for pagination
messageSchema.index({ chat: 1, createdAt: -1 });
exports.messageModel = (0, mongoose_1.model)("Message", messageSchema);
