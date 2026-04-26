import { Server, Socket } from "socket.io";
import { FollowService } from "../services/follow.service";

const followService = new FollowService();

export const followSocketHandler = (io: Server, socket: Socket) => {
    const user = (socket as any).user;

    // ----- FOLLOW USER -----
    socket.on("follow_user", async (data: { userId: string }) => {
        const userId = String(data.userId).trim();
        console.log(`Socket: follow_user from ${user._id} to ${userId}`);
        try {
            let follow = await followService.followUser(user._id, userId);
            console.log(`Follow created: ${follow._id}`);
            
            // Populate to get names for toasts
            follow = await follow.populate("follower", "firstName lastName avatar");
            follow = await follow.populate("following", "firstName lastName avatar");

            io.to(userId).emit("follow_received", follow);
            socket.emit("follow_success", follow);
        } catch (error: any) {
            console.error(`Follow failed: ${error.message}`);
            socket.emit("error_message", { message: error.message || "Failed to follow user" });
        }
    });

    // ----- UNFOLLOW USER -----
    socket.on("unfollow_user", async (data: { userId: string }) => {
        try {
            const { userId } = data;
            await followService.unfollowUser(user._id, userId);
            io.to(userId).emit("unfollow_received", { followerId: user._id });
            socket.emit("unfollow_success", { userId });
        } catch (error) {
            socket.emit("error_message", { message: "Failed to unfollow user" });
        }
    });

    // ----- ACCEPT FOLLOW REQUEST -----
    socket.on("accept_follow_request", async (data: { requestId: string }) => {
        try {
            const { requestId } = data;
            let follow = await followService.acceptRequest(user._id, requestId);
            
            // Populate for toasts
            follow = await follow.populate("follower", "firstName lastName avatar");
            follow = await follow.populate("following", "firstName lastName avatar");

            // Notify the follower that their request was accepted
            io.to(follow.follower._id.toString()).emit("follow_accepted", follow);
            // Also notify the following user (self) to update their list if they have multiple devices
            socket.emit("follow_accepted_self", follow);
        } catch (error) {
            socket.emit("error_message", { message: "Failed to accept follow request" });
        }
    });

    // ----- REJECT FOLLOW REQUEST -----
    socket.on("reject_follow_request", async (data: { requestId: string }) => {
        try {
            const { requestId } = data;
            await followService.rejectRequest(user._id, requestId);
            socket.emit("follow_rejected_success", { requestId });
        } catch (error) {
            socket.emit("error_message", { message: "Failed to reject follow request" });
        }
    });

}