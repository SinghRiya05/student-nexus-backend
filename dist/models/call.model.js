"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callModel = void 0;
const mongoose_1 = require("mongoose");
const callSchema = new mongoose_1.Schema({
    caller: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        index: true,
    },
    chat: {
        type: mongoose_1.Types.ObjectId,
        ref: "Chat",
        index: true,
    },
    participants: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    type: {
        type: String,
        enum: ["voice", "video"],
        required: true,
    },
    status: {
        type: String,
        enum: ["ringing", "ongoing", "ended", "missed", "rejected"],
        default: "ringing",
    },
    isScreenSharing: {
        type: Boolean,
        default: false,
    },
    screenSharedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    duration: {
        type: Number,
        default: 0,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    endedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Indexes for common queries
callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });
callSchema.index({ chat: 1, createdAt: -1 });
exports.callModel = (0, mongoose_1.model)("Call", callSchema);
