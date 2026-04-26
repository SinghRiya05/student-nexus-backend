"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModel = void 0;
const mongoose_1 = require("mongoose");
const like_model_1 = require("./like.model");
const comment_model_1 = require("./comment.model");
const feedSchema = new mongoose_1.Schema({
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for author profile - can be used for deep population
feedSchema.virtual("author", {
    ref: "User",
    localField: "authorId",
    foreignField: "_id",
    justOne: true,
});
feedSchema.pre("findOneAndDelete", async function () {
    const feed = await this.model.findOne(this.getFilter());
    if (feed) {
        await like_model_1.LikeModel.deleteMany({
            feedId: feed._id
        });
        await comment_model_1.CommentModel.deleteMany({
            feedId: feed._id
        });
    }
});
exports.FeedModel = (0, mongoose_1.model)("Feed", feedSchema);
