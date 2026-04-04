import { Types } from "mongoose";

export interface ICall {
  caller: Types.ObjectId;
  receiver?: Types.ObjectId; // For 1:1 calls
  chat?: Types.ObjectId;     // For group calls
  participants: Types.ObjectId[]; // All people in the call
  type: "voice" | "video";
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected";
  isScreenSharing: boolean;
  screenSharedBy?: Types.ObjectId;
  duration: number;          // duration in seconds
  startedAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
