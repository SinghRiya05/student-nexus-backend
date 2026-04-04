import { Schema, model, Types } from "mongoose";
import { ICall } from "../interfaces/masterInterfaces/call.interface";

const callSchema = new Schema<ICall>(
  {
    caller: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },

    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      index: true,
    },

    participants: [
      {
        type: Types.ObjectId,
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
      type: Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });
callSchema.index({ chat: 1, createdAt: -1 });

export const callModel = model<ICall>("Call", callSchema);
