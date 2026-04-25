import { Schema, model, Types } from "mongoose";
import { IFeed } from "../interfaces/masterInterfaces/feed.interface";
import { LikeModel } from "./like.model";
import { CommentModel } from "./comment.model";

const feedSchema = new Schema<IFeed>(
  {
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
    media: {
      type: String,
    },
    hashtags: [
      {
        type: String,
        index: true,
      },
    ],
    link: {
      type: String,
      trim: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for author profile - can be used for deep population
feedSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true,
});

feedSchema.pre("findOneAndDelete", async function () {
  const feed = await this.model.findOne(
    this.getFilter()
  );
  if (feed) {
    await LikeModel.deleteMany({
      feedId: feed._id
    });
    await CommentModel.deleteMany({
      feedId: feed._id
    });
  }
});

export const FeedModel = model<IFeed>("Feed", feedSchema);
