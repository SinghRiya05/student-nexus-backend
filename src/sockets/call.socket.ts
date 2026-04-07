import { Server, Socket } from "socket.io";

export const callSocketHandler = (io: Server, socket: Socket) => {
  const user = (socket as any).user;

  // ----- START CALL -----
  socket.on("call_user", (data: { userToCall: string; signalData: any; from: string; name: string; type: "video" | "voice" }) => {
    console.log(`User ${user.firstName} calling ${data.userToCall}`);
    io.to(data.userToCall).emit("call_user", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      type: data.type,
    });
  });


  // ----- ANSWER CALL -----
  socket.on("answer_call", (data: { to: string; signal: any }) => {
    console.log(`User ${user.firstName} answering call from ${data.to}`);
    io.to(data.to).emit("call_accepted", data.signal);
  });


  // ----- END CALL -----
  socket.on("end_call", (data: { to: string }) => {
    console.log(`User ${user.firstName} ended/rejected call for ${data.to}`);
    io.to(data.to).emit("call_ended");
  });


  // ----- SCREEN SHARE TOGGLE -----
  socket.on("screen_share_toggle", (data: { to: string; isSharing: boolean }) => {
    console.log(`User ${user.firstName} screen share status: ${data.isSharing}`);
    io.to(data.to).emit("screen_share_status", { isSharing: data.isSharing });
  });


  // ----- ICE CANDIDATE EXCHANGE -----
  socket.on("ice_candidate", (data: { to: string; candidate: any }) => {
    io.to(data.to).emit("ice_candidate", data.candidate);
  });

  console.log(`Call handlers registered for user: ${user.firstName}`);
};
