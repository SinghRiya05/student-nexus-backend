import { Router } from "express";
import { FollowController } from "../../controllers/follow.controller";

const followRouter = Router();
const followController = new FollowController();

followRouter.post("/:id", followController.followUser);
followRouter.delete("/:id", followController.unfollowUser);
followRouter.patch("/accept-request/:id", followController.acceptRequest);
followRouter.delete("/reject-request/:id", followController.rejectRequest);

followRouter.get("/followers", followController.getFollowers);
followRouter.get("/following", followController.getFollowing);

followRouter.get("/followers/ai", followController.getFollowersForAI);
followRouter.get("/following/ai", followController.getFollowingForAI);

followRouter.get("/pending-requests", followController.getPendingRequests);
followRouter.get("/sent-requests", followController.getSentRequests);

export default followRouter;
