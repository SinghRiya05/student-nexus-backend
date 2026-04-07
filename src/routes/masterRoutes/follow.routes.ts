import { Router } from "express";
import { FollowController } from "../../controllers/follow.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";

const followRouter = Router();
const followController = new FollowController();

// All follow routes are protected by authMiddleware
followRouter.use(authMiddleware);

followRouter.post("/:id", followController.followUser);
followRouter.delete("/:id", followController.unfollowUser);
followRouter.patch("/accept-request/:id", followController.acceptRequest);
followRouter.delete("/reject-request/:id", followController.rejectRequest);

followRouter.get("/followers", followController.getFollowers);
followRouter.get("/following", followController.getFollowing);
followRouter.get("/pending-requests", followController.getPendingRequests);

export default followRouter;
