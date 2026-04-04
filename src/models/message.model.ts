import { Schema, model, Types } from "mongoose";
import { IMessage } from "../interfaces/masterInterfaces/message.interface";

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: Types.ObjectId,
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
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    deliveredTo: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Important index for pagination
messageSchema.index({ chat: 1, createdAt: -1 });

export const messageModel = model<IMessage>("Message", messageSchema);
