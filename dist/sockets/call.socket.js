"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSocketHandler = void 0;
const callSocketHandler = (io, socket) => {
    const user = socket.user;
    // ----- START CALL -----
    socket.on("call_user", (data) => {
        console.log(`User ${user.firstName} calling ${data.userToCall}`);
        io.to(data.userToCall).emit("call_user", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
            type: data.type,
        });
    });
    // ----- ANSWER CALL -----
    socket.on("answer_call", (data) => {
        console.log(`User ${user.firstName} answering call from ${data.to}`);
        io.to(data.to).emit("call_accepted", data.signal);
    });
    // ----- END CALL -----
    socket.on("end_call", (data) => {
        console.log(`User ${user.firstName} ended/rejected call for ${data.to}`);
        io.to(data.to).emit("call_ended");
    });
    // ----- SCREEN SHARE TOGGLE -----
    socket.on("screen_share_toggle", (data) => {
        console.log(`User ${user.firstName} screen share status: ${data.isSharing}`);
        io.to(data.to).emit("screen_share_status", { isSharing: data.isSharing });
    });
    // ----- ICE CANDIDATE EXCHANGE -----
    socket.on("ice_candidate", (data) => {
        io.to(data.to).emit("ice_candidate", data.candidate);
    });
    console.log(`Call handlers registered for user: ${user.firstName}`);
};
exports.callSocketHandler = callSocketHandler;
