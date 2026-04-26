"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
const follow_service_1 = require("../services/follow.service");
const catchAsync_1 = require("../core/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const followService = new follow_service_1.FollowService();
class FollowController {
    constructor() {
        // ----- FOLLOW USER -----
        this.followUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id: followingId } = req.params;
            const followerId = req.user?._id;
            const result = await followService.followUser(followerId, followingId);
            const message = result.status === "PENDING"
                ? "Follow request sent successfully."
                : "You are now following the user successfully.";
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, message, result);
        });
        // ----- UNFOLLOW USER -----
        this.unfollowUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id: followingId } = req.params;
            const followerId = req.user?._id;
            await followService.unfollowUser(followerId, followingId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Unfollowed user successfully.");
        });
        // ----- ACCEPT FOLLOW REQUEST -----
        this.acceptRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id: requestId } = req.params;
            const userId = req.user?._id;
            const result = await followService.acceptRequest(userId, requestId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Follow request accepted successfully.", result);
        });
        // ----- REJECT FOLLOW REQUEST -----
        this.rejectRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id: requestId } = req.params;
            const userId = req.user?._id;
            await followService.rejectRequest(userId, requestId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Follow request rejected successfully.");
        });
        // ----- GET FOLLOWERS -----
        this.getFollowers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const followers = await followService.getFollowers(userId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Followers list fetched successfully.", followers);
        });
        // ----- GET FOLLOWING -----
        this.getFollowing = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const following = await followService.getFollowing(userId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Following list fetched successfully.", following);
        });
        // ----- GET PENDING REQUESTS -----
        this.getPendingRequests = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const requests = await followService.getPendingRequests(userId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Pending follow requests fetched successfully.", requests);
        });
        // ----- GET SENT REQUESTS -----
        this.getSentRequests = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const requests = await followService.getSentRequests(userId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Sent follow requests fetched successfully.", requests);
        });
    }
}
exports.FollowController = FollowController;
