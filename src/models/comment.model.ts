import { Schema, model, Types } from "mongoose";
import { IComment } from "../interfaces/masterInterfaces/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel = model<IComment>("Comment", commentSchema);
