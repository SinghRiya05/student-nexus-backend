"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const feed_model_1 = require("../models/feed.model");
const comment_model_1 = require("../models/comment.model");
const like_model_1 = require("../models/like.model");
const errors_1 = require("../core/errors");
const file_utils_1 = require("../utils/file.utils");
class FeedService {
    constructor() {
        // ---- CREATE FEED POST ----
        this.create = async (userId, data, file) => {
            if (file) {
                data.media = `/uploads/media/${file.filename}`;
            }
            data.hashtags = this.sanitizeHashtags(data.hashtags);
            const feed = await feed_model_1.FeedModel.create({ ...data, authorId: userId });
            return await feed_model_1.FeedModel.findById(feed._id).populate({
                path: "authorId",
                select: "firstName lastName avatar roleId universityId",
                populate: [
                    { path: "roleId", select: "name" },
                    { path: "universityId", select: "name" },
                ],
            });
        };
        // ---- GET ALL FEED POSTS ----
        this.getAll = async (userId, query) => {
            const { page = 1, limit = 10, search, sortBy } = query;
            const skip = (Number(page) - 1) * Number(limit);
            const filter = { isDeleted: false };
            if (search) {
                filter.$or = [
                    { content: { $regex: search, $options: "i" } },
                    { hashtags: { $regex: search, $options: "i" } },
                ];
            }
            // Determine sort order
            let sort = { createdAt: -1 };
            if (sortBy === "likes")
                sort = { likesCount: -1 };
            else if (sortBy === "views")
                sort = { viewsCount: -1 };
            else if (sortBy === "comments")
                sort = { commentsCount: -1 };
            const feeds = await feed_model_1.FeedModel.find(filter)
                .populate({
                path: "authorId",
                select: "firstName lastName avatar roleId universityId",
                populate: [
                    { path: "roleId", select: "name" },
                    { path: "universityId", select: "name" },
                ],
            })
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .lean();
            // Check if user has liked each feed
            const userLikes = userId
                ? await like_model_1.LikeModel.find({
                    authorId: userId,
                    feedId: { $in: feeds.map((f) => f._id) },
                }).select("feedId")
                : [];
            const likedFeedIds = new Set(userLikes.map((l) => l.feedId.toString()));
            const sanitizedFeeds = feeds.map((feed) => {
                feed.hashtags = this.sanitizeHashtags(feed.hashtags);
                feed.isLiked = likedFeedIds.has(feed._id.toString());
                return feed;
            });
            const total = await feed_model_1.FeedModel.countDocuments(filter);
            return {
                feeds: sanitizedFeeds,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                },
            };
        };
        // ---- GET FEED POST BY AUTHOR ID ----
        this.getByAuthorId = async (userId, authorId, query) => {
            const { page = 1, limit = 10 } = query;
            const skip = (Number(page) - 1) * Number(limit);
            const filter = { authorId, isDeleted: false };
            const feeds = await feed_model_1.FeedModel.find(filter)
                .populate({
                path: "authorId",
                select: "firstName lastName avatar roleId universityId",
                populate: [
                    { path: "roleId", select: "name" },
                    { path: "universityId", select: "name" },
                ],
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean();
            // Check if user has liked each feed
            const userLikes = userId
                ? await like_model_1.LikeModel.find({
                    authorId: userId,
                    feedId: { $in: feeds.map((f) => f._id) },
                }).select("feedId")
                : [];
            const likedFeedIds = new Set(userLikes.map((l) => l.feedId.toString()));
            const total = await feed_model_1.FeedModel.countDocuments(filter);
            const sanitizedFeeds = feeds.map((feed) => {
                feed.hashtags = this.sanitizeHashtags(feed.hashtags);
                feed.isLiked = likedFeedIds.has(feed._id.toString());
                return feed;
            });
            return {
                feeds: sanitizedFeeds,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                },
            };
        };
        // ---- GET TRENDING HASHTAGS ----
        this.getTrendingHashtags = async () => {
            // Get top 50 posts by engagement
            const topPosts = await feed_model_1.FeedModel.find({ isDeleted: false })
                .sort({ viewsCount: -1, likesCount: -1 })
                .limit(50)
                .select("hashtags");
            const hashtagCounts = {};
            topPosts.forEach((post) => {
                const tags = this.sanitizeHashtags(post.hashtags);
                tags.forEach((tag) => {
                    if (tag) {
                        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
                    }
                });
            });
            // Sort by frequency and take top 10
            const trendingTags = Object.entries(hashtagCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([tag]) => tag);
            return trendingTags;
        };
        // ---- GET FEED POST BY ID ----
        this.getById = async (userId, id) => {
            const feed = await feed_model_1.FeedModel.findOne({
                _id: id,
                isDeleted: false,
            })
                .populate({
                path: "authorId",
                select: "firstName lastName avatar roleId universityId",
                populate: [
                    { path: "roleId", select: "name" },
                    { path: "universityId", select: "name" },
                ],
            })
                .lean();
            if (!feed)
                throw new errors_1.NotFoundError("Feed post not found");
            const sanitizedFeed = feed;
            sanitizedFeed.hashtags = this.sanitizeHashtags(sanitizedFeed.hashtags);
            if (userId) {
                const existingLike = await like_model_1.LikeModel.findOne({
                    feedId: id,
                    authorId: userId,
                });
                sanitizedFeed.isLiked = !!existingLike;
            }
            // Update views count (don't use lean object for saving)
            await feed_model_1.FeedModel.updateOne({ _id: id }, { $inc: { viewsCount: 1 } });
            sanitizedFeed.viewsCount += 1;
            return sanitizedFeed;
        };
        // ---- UPDATE FEED POST ----
        this.update = async (userId, id, data, file) => {
            const feed = await feed_model_1.FeedModel.findOne({ _id: id, isDeleted: false });
            if (!feed)
                throw new errors_1.NotFoundError("Feed post not found");
            if (feed.authorId.toString() !== userId) {
                throw new errors_1.UnauthorizedError("You are not authorized to update this post");
            }
            if (file) {
                if (feed.media) {
                    (0, file_utils_1.deleteFileIfExists)(feed.media);
                }
                data.media = `/uploads/media/${file.filename}`;
            }
            if (data.hashtags) {
                data.hashtags = this.sanitizeHashtags(data.hashtags);
            }
            Object.assign(feed, data);
            feed.hashtags = this.sanitizeHashtags(feed.hashtags);
            await feed.save();
            return await feed_model_1.FeedModel.findById(feed._id).populate({
                path: "authorId",
                select: "firstName lastName avatar roleId universityId",
                populate: [
                    { path: "roleId", select: "name" },
                    { path: "universityId", select: "name" },
                ],
            });
        };
        // ---- DELETE FEED POST ----
        this.delete = async (userId, id) => {
            const feed = await feed_model_1.FeedModel.findOne({ _id: id, isDeleted: false });
            if (!feed)
                throw new errors_1.NotFoundError("Feed post not found");
            if (feed.authorId.toString() !== userId) {
                throw new errors_1.UnauthorizedError("You are not authorized to delete this post");
            }
            if (feed.media) {
                (0, file_utils_1.deleteFileIfExists)(feed.media);
            }
            feed.isDeleted = true;
            await feed.save();
            return feed;
        };
        // ---- TOGGLE LIKE ----
        this.toggleLike = async (userId, feedId) => {
            const feed = await feed_model_1.FeedModel.findOne({ _id: feedId, isDeleted: false });
            if (!feed)
                throw new errors_1.NotFoundError("Feed post not found");
            const existingLike = await like_model_1.LikeModel.findOne({ feedId, authorId: userId });
            if (existingLike) {
                await like_model_1.LikeModel.deleteOne({ _id: existingLike._id });
                feed.likesCount = Math.max(0, feed.likesCount - 1);
                await feed.save();
                return { liked: false, likesCount: feed.likesCount };
            }
            else {
                await like_model_1.LikeModel.create({ feedId, authorId: userId });
                feed.likesCount += 1;
                await feed.save();
                return { liked: true, likesCount: feed.likesCount };
            }
        };
        // ---- ADD COMMENT ----
        this.addComment = async (userId, feedId, content) => {
            const feed = await feed_model_1.FeedModel.findOne({ _id: feedId, isDeleted: false });
            if (!feed)
                throw new errors_1.NotFoundError("Feed post not found");
            const comment = await comment_model_1.CommentModel.create({
                feedId,
                authorId: userId,
                content,
            });
            feed.commentsCount += 1;
            await feed.save();
            return await comment_model_1.CommentModel.findById(comment._id).populate("authorId", "firstName lastName avatar");
        };
        // ---- GET COMMENTS ----
        this.getComments = async (feedId) => {
            const comments = await comment_model_1.CommentModel.find({ feedId, isDeleted: false })
                .populate("authorId", "firstName lastName avatar")
                .sort({ createdAt: -1 });
            return comments;
        };
        this.deleteComment = async (userId, commentId) => {
            const comment = await comment_model_1.CommentModel.findOne({
                _id: commentId,
                isDeleted: false
            });
            if (!comment) {
                throw new errors_1.NotFoundError("Comment not found");
            }
            // Fetch post
            const feed = await feed_model_1.FeedModel.findById(comment.feedId);
            if (!feed) {
                throw new errors_1.NotFoundError("Feed post not found");
            }
            // Check authorization
            const isCommentAuthor = comment.authorId.toString() === userId;
            const isPostOwner = feed.authorId.toString() === userId;
            if (!isCommentAuthor && !isPostOwner) {
                throw new errors_1.UnauthorizedError("You are not authorized to delete this comment");
            }
            comment.isDeleted = true;
            await comment.save();
            return comment;
        };
    }
    // ---- HELPER FUNCTIONS ----
    sanitizeHashtags(hashtags) {
        if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
            return hashtags || [];
        }
        if (hashtags.length === 1 &&
            typeof hashtags[0] === "string" &&
            hashtags[0].trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(hashtags[0].trim());
                if (Array.isArray(parsed)) {
                    return parsed.map((v) => String(v).trim());
                }
            }
            catch (e) {
            }
        }
        return hashtags.map((v) => String(v).trim());
    }
}
exports.FeedService = FeedService;
