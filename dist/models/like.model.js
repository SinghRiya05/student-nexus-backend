"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModel = void 0;
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    feedId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Feed",
        required: true,
    },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
// Compound index to ensure a user can only like a post once
likeSchema.index({ feedId: 1, authorId: 1 }, { unique: true });
exports.LikeModel = (0, mongoose_1.model)("Like", likeSchema);
