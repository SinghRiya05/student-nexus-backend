import { Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
  readBy: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  messageType: "text" | "image" | "video" | "file";
  attachments?: {
    url: string;
    fileType: string;
    size: number;
  }[];
  deliveredTo: Types.ObjectId[];
  isDeleted: boolean;
}
