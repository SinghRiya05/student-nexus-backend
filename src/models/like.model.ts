import { Schema, model, Types } from "mongoose";
import { ILike } from "../interfaces/masterInterfaces/like.interface";

const likeSchema = new Schema<ILike>(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only like a post once
likeSchema.index({ feedId: 1, authorId: 1 }, { unique: true });

export const LikeModel = model<ILike>("Like", likeSchema);
