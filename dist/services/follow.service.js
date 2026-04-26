"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const user_model_1 = require("../models/user.model");
const follow_model_1 = require("../models/follow.model");
const mongoose_1 = require("mongoose");
class FollowService {
    constructor() {
        // ----- FOLLOW USER -----
        this.followUser = async (followerId, followingId) => {
            if (String(followerId) === String(followingId))
                throw new Error("You cannot follow yourself");
            const targetUser = await user_model_1.userModel.findById(followingId);
            if (!targetUser)
                throw new Error("User to follow not found");
            // Check if relationship already exists
            const existingFollow = await follow_model_1.followModel.findOne({
                follower: new mongoose_1.Types.ObjectId(followerId),
                following: new mongoose_1.Types.ObjectId(followingId),
            });
            if (existingFollow) {
                if (existingFollow.status === "PENDING")
                    throw new Error("Follow request already pending");
                throw new Error("You are already following this user");
            }
            const session = await user_model_1.userModel.startSession();
            session.startTransaction();
            try {
                const reverseFollow = await follow_model_1.followModel.findOne({
                    follower: new mongoose_1.Types.ObjectId(followingId),
                    following: new mongoose_1.Types.ObjectId(followerId),
                    status: "ACCEPTED",
                });
                const status = reverseFollow ? "ACCEPTED" : "PENDING";
                const follow = await follow_model_1.followModel.create([
                    {
                        follower: new mongoose_1.Types.ObjectId(followerId),
                        following: new mongoose_1.Types.ObjectId(followingId),
                        status,
                    },
                ], { session });
                if (status === "ACCEPTED") {
                    await user_model_1.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }, { session });
                    await user_model_1.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } }, { session });
                }
                await session.commitTransaction();
                session.endSession();
                return follow[0];
            }
            catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };
        // ----- UNFOLLOW USER -----
        this.unfollowUser = async (followerId, followingId) => {
            const follow = await follow_model_1.followModel.findOne({
                follower: new mongoose_1.Types.ObjectId(followerId),
                following: new mongoose_1.Types.ObjectId(followingId),
            });
            if (!follow)
                throw new Error("You are not following this user");
            const session = await user_model_1.userModel.startSession();
            session.startTransaction();
            try {
                const wasAccepted = follow.status === "ACCEPTED";
                await follow_model_1.followModel.deleteOne({ _id: follow._id }, { session });
                if (wasAccepted) {
                    await user_model_1.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }, { session });
                    await user_model_1.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } }, { session });
                }
                await session.commitTransaction();
                session.endSession();
                return true;
            }
            catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };
        // ----- ACCEPT FOLLOW REQUEST -----
        this.acceptRequest = async (userId, requestId) => {
            // Look for the pending request by its unique ID
            const follow = await follow_model_1.followModel.findOne({
                _id: new mongoose_1.Types.ObjectId(requestId),
                following: new mongoose_1.Types.ObjectId(userId),
            });
            if (!follow) {
                throw new Error("Follow request not found");
            }
            if (follow.status === "ACCEPTED") {
                throw new Error(`Follow relationship between ${follow.follower} and ${userId} is already ACCEPTED. No pending request found to accept.`);
            }
            const session = await user_model_1.userModel.startSession();
            session.startTransaction();
            try {
                follow.status = "ACCEPTED";
                await follow.save({ session });
                await user_model_1.userModel.findByIdAndUpdate(follow.follower, { $inc: { followingCount: 1 } }, { session });
                await user_model_1.userModel.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } }, { session });
                await session.commitTransaction();
                session.endSession();
                return follow;
            }
            catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };
        // ----- REJECT FOLLOW REQUEST -----
        this.rejectRequest = async (userId, requestId) => {
            const result = await follow_model_1.followModel.findOneAndDelete({
                _id: new mongoose_1.Types.ObjectId(requestId),
                following: new mongoose_1.Types.ObjectId(userId),
                status: "PENDING",
            });
            if (!result)
                throw new Error("Follow request not found");
            return true;
        };
        // ----- GET FOLLOWERS -----
        this.getFollowers = async (userId) => {
            return await follow_model_1.followModel
                .find({ following: new mongoose_1.Types.ObjectId(userId) })
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
        this.getFollowing = async (userId) => {
            return await follow_model_1.followModel
                .find({ follower: new mongoose_1.Types.ObjectId(userId) })
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
        this.getPendingRequests = async (userId) => {
            return await follow_model_1.followModel
                .find({ following: new mongoose_1.Types.ObjectId(userId), status: "PENDING" })
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
        this.getSentRequests = async (userId) => {
            return await follow_model_1.followModel
                .find({ follower: new mongoose_1.Types.ObjectId(userId), status: "PENDING" })
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
}
exports.FollowService = FollowService;
