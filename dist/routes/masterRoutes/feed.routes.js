"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_controller_1 = require("../../controllers/feed.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const imageUpload_middleware_1 = require("../../middlewares/imageUpload.middleware");
const feed_validation_1 = require("../../validations/feed.validation");
const optionalAuthMiddleware_1 = require("../../middlewares/optionalAuthMiddleware");
const feedRouter = (0, express_1.Router)();
const feedController = new feed_controller_1.FeedController();
// Public routes (with optional auth for personalized data)
feedRouter.get("/", optionalAuthMiddleware_1.optionalAuthMiddleware, feedController.getAll);
feedRouter.get("/trending-hashtags", feedController.getTrendingHashtags);
feedRouter.get("/author/:authorId", optionalAuthMiddleware_1.optionalAuthMiddleware, feedController.getByAuthorId);
feedRouter.get("/:id", (0, validateRequest_1.validateRequest)(feed_validation_1.feedIdSchema), optionalAuthMiddleware_1.optionalAuthMiddleware, feedController.getById);
feedRouter.get("/:id/comments", (0, validateRequest_1.validateRequest)(feed_validation_1.feedIdSchema), feedController.getComments);
// Authenticated routes
feedRouter.use(authMiddleware_1.middleware);
feedRouter.post("/", (0, imageUpload_middleware_1.uploadTo)("media").single("media"), (0, validateRequest_1.validateRequest)(feed_validation_1.createFeedSchema), feedController.create);
feedRouter.put("/:id", (0, imageUpload_middleware_1.uploadTo)("media").single("media"), (0, validateRequest_1.validateRequest)(feed_validation_1.updateFeedSchema), feedController.update);
feedRouter.delete("/:id", (0, validateRequest_1.validateRequest)(feed_validation_1.feedIdSchema), feedController.delete);
// Interaction routes
feedRouter.post("/:id/like", (0, validateRequest_1.validateRequest)(feed_validation_1.feedIdSchema), feedController.toggleLike);
feedRouter.post("/:id/comment", (0, validateRequest_1.validateRequest)(feed_validation_1.commentSchema), feedController.addComment);
feedRouter.delete("/comment/:commentId", (0, validateRequest_1.validateRequest)(feed_validation_1.feedIdSchema), feedController.deleteComment);
exports.default = feedRouter;
