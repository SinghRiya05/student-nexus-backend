import { Request, Response } from "express";
import { FollowService } from "../services/follow.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

const followService = new FollowService();

export class FollowController {
  // ----- FOLLOW USER -----
  followUser = catchAsync(async (req: Request, res: Response) => {
    const { id: followingId } = req.params;
    const followerId = (req as any).user?._id;

    const result = await followService.followUser(
      followerId as string,
      followingId as string,
    );

    const message =
      result.status === "PENDING"
        ? "Follow request sent successfully."
        : "You are now following the user successfully.";

    sendResponse(res, STATUS_CODES.SUCCESS, true, message, result);
  });

  // ----- UNFOLLOW USER -----
  unfollowUser = catchAsync(async (req: Request, res: Response) => {
    const { id: followingId } = req.params;
    const followerId = (req as any).user?._id;

    await followService.unfollowUser(
      followerId as string,
      followingId as string,
    );
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Unfollowed user successfully.",
    );
  });

  // ----- ACCEPT FOLLOW REQUEST -----
  acceptRequest = catchAsync(async (req: Request, res: Response) => {
    const { id: requestId } = req.params;
    const userId = (req as any).user?._id;

    const result = await followService.acceptRequest(
      userId as string,
      requestId as string,
    );
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Follow request accepted successfully.",
      result,
    );
  });

  // ----- REJECT FOLLOW REQUEST -----
  rejectRequest = catchAsync(async (req: Request, res: Response) => {
    const { id: requestId } = req.params;
    const userId = (req as any).user?._id;

    await followService.rejectRequest(userId as string, requestId as string);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Follow request rejected successfully.",
    );
  });

  // ----- GET FOLLOWERS -----
  getFollowers = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const followers = await followService.getFollowers(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Followers list fetched successfully.",
      followers,
    );
  });

  // ----- GET FOLLOWERS For AI -----
  getFollowersForAI = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const followers = await followService.getFollowersForAI(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Followers list fetched successfully.",
      followers,
    );
  });

  // ----- GET FOLLOWING -----
  getFollowing = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const following = await followService.getFollowing(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Following list fetched successfully.",
      following,
    );
  });

  // ----- GET FOLLOWING For AI -----
  getFollowingForAI = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const following = await followService.getFollowingForAI(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Following list fetched successfully.",
      following,
    );
  });

  // ----- GET PENDING REQUESTS -----
  getPendingRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const requests = await followService.getPendingRequests(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Pending follow requests fetched successfully.",
      requests,
    );
  });

  // ----- GET SENT REQUESTS -----
  getSentRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const requests = await followService.getSentRequests(userId);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Sent follow requests fetched successfully.",
      requests,
    );
  });
}
