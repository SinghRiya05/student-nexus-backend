import { Schema, model, Types } from "mongoose";
import { IFollow } from "../interfaces/masterInterfaces/follow.interface";

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    following: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED"],
      default: "PENDING",
      required: true
    }
  },
  { timestamps: true }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const followModel = model<IFollow>("Follow", followSchema);