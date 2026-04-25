import { userModel } from "../models/user.model";
import { followModel } from "../models/follow.model";
import { Types } from "mongoose";

export class FollowService {

  // ----- FOLLOW USER -----
  followUser = async (followerId: string, followingId: string) => {
    if (String(followerId) === String(followingId))
      throw new Error("You cannot follow yourself");

    const targetUser = await userModel.findById(followingId);
    if (!targetUser) throw new Error("User to follow not found");

    // Check if relationship already exists
    const existingFollow = await followModel.findOne({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    if (existingFollow) {
      if (existingFollow.status === "PENDING")
        throw new Error("Follow request already pending");
      throw new Error("You are already following this user");
    }

    const session = await userModel.startSession();
    session.startTransaction();

    try {
      const reverseFollow = await followModel.findOne({
        follower: new Types.ObjectId(followingId),
        following: new Types.ObjectId(followerId),
        status: "ACCEPTED",
      });

      const status = reverseFollow ? "ACCEPTED" : "PENDING";

      const follow = await followModel.create(
        [
          {
            follower: new Types.ObjectId(followerId),
            following: new Types.ObjectId(followingId),
            status,
          },
        ],
        { session }
      );

      if (status === "ACCEPTED") {
        await userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }, { session });
        await userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } }, { session });
      }

      await session.commitTransaction();
      session.endSession();
      return follow[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  // ----- UNFOLLOW USER -----
  unfollowUser = async (followerId: string, followingId: string) => {
    const follow = await followModel.findOne({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    if (!follow) throw new Error("You are not following this user");

    const session = await userModel.startSession();
    session.startTransaction();

    try {
      const wasAccepted = follow.status === "ACCEPTED";
      await followModel.deleteOne({ _id: follow._id }, { session });

      if (wasAccepted) {
        await userModel.findByIdAndUpdate(
          followerId,
          { $inc: { followingCount: -1 } },
          { session },
        );
        await userModel.findByIdAndUpdate(
          followingId,
          { $inc: { followersCount: -1 } },
          { session },
        );
      }

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };


  // ----- ACCEPT FOLLOW REQUEST -----
  acceptRequest = async (userId: string, requestId: string) => {
    // Look for the pending request by its unique ID
    const follow = await followModel.findOne({
      _id: new Types.ObjectId(requestId),
      following: new Types.ObjectId(userId),
    });

    if (!follow) {
      throw new Error("Follow request not found");
    }

    if (follow.status === "ACCEPTED") {
      throw new Error(
        `Follow relationship between ${follow.follower} and ${userId} is already ACCEPTED. No pending request found to accept.`,
      );
    }

    const session = await userModel.startSession();
    session.startTransaction();

    try {
      follow.status = "ACCEPTED";
      await follow.save({ session });

      await userModel.findByIdAndUpdate(
        follow.follower,
        { $inc: { followingCount: 1 } },
        { session },
      );
      await userModel.findByIdAndUpdate(
        userId,
        { $inc: { followersCount: 1 } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return follow;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  // ----- REJECT FOLLOW REQUEST -----
  rejectRequest = async (userId: string, requestId: string) => {
    const result = await followModel.findOneAndDelete({
      _id: new Types.ObjectId(requestId),
      following: new Types.ObjectId(userId),
      status: "PENDING",
    });

    if (!result) throw new Error("Follow request not found");
    return true;
  };

  // ----- GET FOLLOWERS -----
  getFollowers = async (userId: string) => {
    return await followModel
      .find({ following: new Types.ObjectId(userId) })
      .populate({
        path: "follower",
        select: "firstName lastName avatar bio roleId",
        populate: {
          path: "roleId",
          select: "name",
        },
      });
  };

  // ----- GET FOLLOWING -----
  getFollowing = async (userId: string) => {
    return await followModel
      .find({ follower: new Types.ObjectId(userId) })
      .populate({
        path: "following",
        select: "firstName lastName avatar bio roleId",
        populate: {
          path: "roleId",
          select: "name",
        },
      });
  };

  // ----- GET PENDING REQUESTS -----
  getPendingRequests = async (userId: string) => {
    return await followModel
      .find({ following: new Types.ObjectId(userId), status: "PENDING" })
      .populate({
        path: "follower",
        select: "firstName lastName avatar bio roleId",
        populate: {
          path: "roleId",
          select: "name",
        },
      });
  };

  // ----- GET SENT REQUESTS -----
  getSentRequests = async (userId: string) => {
    return await followModel
      .find({ follower: new Types.ObjectId(userId), status: "PENDING" })
      .populate({
        path: "following",
        select: "firstName lastName avatar bio roleId",
        populate: {
          path: "roleId",
          select: "name",
        },
      });
  };
}
