"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const feed_service_1 = require("../services/feed.service");
const sendResponse_1 = require("../utils/sendResponse");
const catchAsync_1 = require("../core/catchAsync");
const config_1 = require("../config");
const cloudinaryUpload_1 = __importDefault(require("../utils/cloudinaryUpload"));
const feedService = new feed_service_1.FeedService();
class FeedController {
    constructor() {
        // ---- CREATE FEED POST ----
        this.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            if (req.file) {
                const { url } = await (0, cloudinaryUpload_1.default)(req.file);
                req.body.media = url;
            }
            const result = await feedService.create(userId, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Feed post created successfully", result);
        });
        // ---- GET ALL FEED POSTS ----
        this.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id?.toString();
            const result = await feedService.getAll(userId, req.query);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Feeds retrieved successfully", result.feeds);
        });
        // ---- GET TRENDING HASHTAGS ----
        this.getTrendingHashtags = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const result = await feedService.getTrendingHashtags();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Trending hashtags retrieved successfully", result);
        });
        // ---- GET FEED POST BY AUTHOR ID ----
        this.getByAuthorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id?.toString();
            const authorId = req.params.authorId;
            const result = await feedService.getByAuthorId(userId, authorId, req.query);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Feeds by author retrieved successfully", result.feeds);
        });
        // ---- GET FEED POST BY ID ----
        this.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id?.toString();
            const id = req.params.id;
            const result = await feedService.getById(userId, id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Feed post retrieved successfully", result);
        });
        // ---- UPDATE FEED POST ----
        this.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            const id = req.params.id;
            if (req.file) {
                const { url } = await (0, cloudinaryUpload_1.default)(req.file);
                req.body.media = url;
            }
            const result = await feedService.update(userId, id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Feed post updated successfully", result);
        });
        // ---- DELETE FEED POST ----
        this.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            const id = req.params.id;
            await feedService.delete(userId, id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Feed post deleted successfully");
        });
        // ---- TOGGLE LIKE ----
        this.toggleLike = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            const id = req.params.id;
            const result = await feedService.toggleLike(userId, id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, result.liked ? "Post liked" : "Post unliked", result);
        });
        // ---- ADD COMMENT ----
        this.addComment = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            const id = req.params.id;
            const result = await feedService.addComment(userId, id, req.body.content);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Comment added successfully", result);
        });
        // ---- GET COMMENTS ----
        this.getComments = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const id = req.params.id;
            const result = await feedService.getComments(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Comments retrieved successfully", result);
        });
        // ---- DELETE COMMENT ----
        this.deleteComment = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user._id.toString();
            const commentId = req.params.commentId;
            const result = await feedService.deleteComment(userId, commentId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Comment deleted successfully", result);
        });
    }
}
exports.FeedController = FeedController;
