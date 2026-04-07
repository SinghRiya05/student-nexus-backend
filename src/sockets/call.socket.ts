import { Server, Socket } from "socket.io";

export const callSocketHandler = (io: Server, socket: Socket) => {
  const user = (socket as any).user;

  /**
   * Signaling: Start a call (Initiate)
   */
  socket.on("call_user", (data: { userToCall: string; signalData: any; from: string; name: string; type: "video" | "voice" }) => {
    console.log(`User ${user.firstName} calling ${data.userToCall}`);
    
    // Relay the call offer to the target user's personal room
    io.to(data.userToCall).emit("call_user", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      type: data.type,
    });
  });

  /**
   * Signaling: Answer a call (Accept)
   */
  socket.on("answer_call", (data: { to: string; signal: any }) => {
    console.log(`User ${user.firstName} answering call from ${data.to}`);
    
    // Relay the answer signal back to the caller's personal room
    io.to(data.to).emit("call_accepted", data.signal);
  });

  /**
   * Signaling: End / Reject Call
   */
  socket.on("end_call", (data: { to: string }) => {
    console.log(`User ${user.firstName} ended/rejected call for ${data.to}`);
    
    // Notify the other party that the call has ended
    io.to(data.to).emit("call_ended");
  });

  /**
   * Signaling: Screen Sharing Toggle
   */
  socket.on("screen_share_toggle", (data: { to: string; isSharing: boolean }) => {
    console.log(`User ${user.firstName} screen share status: ${data.isSharing}`);
    
    // Notify the peer about the status change
    io.to(data.to).emit("screen_share_status", { isSharing: data.isSharing });
  });

  /**
   * WebRTC Signaling: ICE Candidate Exchange
   */
  socket.on("ice_candidate", (data: { to: string; candidate: any }) => {
    // Relay network candidates to the other party
    io.to(data.to).emit("ice_candidate", data.candidate);
  });

  console.log(`Call handlers registered for user: ${user.firstName}`);
};
