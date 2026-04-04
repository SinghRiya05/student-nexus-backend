import { Schema, model, Types } from "mongoose";
import { IChat } from "../interfaces/masterInterfaces/chat.interface";

const chatSchema = new Schema<IChat>(
  {
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
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    groupAdmin: {
      type: Types.ObjectId,
      ref: "User",
    },

    chatAvatar: {
      type: String,
    },

    description: {
      type: String,
    },

    latestMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for fast queries
chatSchema.index({ users: 1 });
chatSchema.index({ lastActivity: -1 });

export const chatModel = model<IChat>("Chat", chatSchema);
