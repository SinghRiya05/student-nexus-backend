import { Router } from "express";
import { FeedController } from "../../controllers/feed.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";
import { uploadTo } from "../../middlewares/imageUpload.middleware";
import { createFeedSchema, updateFeedSchema, commentSchema, feedIdSchema } from "../../validations/feed.validation";

const feedRouter = Router();
const feedController = new FeedController();

// Public routes
feedRouter.get("/", feedController.getAll);
feedRouter.get("/trending-hashtags", feedController.getTrendingHashtags);
feedRouter.get("/author/:authorId", feedController.getByAuthorId);
feedRouter.get("/:id", validateRequest(feedIdSchema), feedController.getById);
feedRouter.get("/:id/comments", validateRequest(feedIdSchema), feedController.getComments);

// Authenticated routes
feedRouter.use(authMiddleware);

feedRouter.post("/", uploadTo("media").single("media"), validateRequest(createFeedSchema), feedController.create);
feedRouter.put("/:id", uploadTo("media").single("media"), validateRequest(updateFeedSchema), feedController.update);
feedRouter.delete("/:id", validateRequest(feedIdSchema), feedController.delete);

// Interaction routes
feedRouter.post("/:id/like", validateRequest(feedIdSchema), feedController.toggleLike);
feedRouter.post("/:id/comment", validateRequest(commentSchema), feedController.addComment);

export default feedRouter;
