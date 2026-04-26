"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    groupAdmin: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    chatAvatar: {
        type: String,
    },
    description: {
        type: String,
    },
    latestMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: "Message",
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Indexes for fast queries
chatSchema.index({ users: 1 });
chatSchema.index({ lastActivity: -1 });
exports.chatModel = (0, mongoose_1.model)("Chat", chatSchema);
