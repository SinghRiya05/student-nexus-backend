import { Server } from "socket.io";
import { pubClient, subClient, connectRedis } from "../core/redis";
import env from "../core/env";
import { verifyAccessToken } from "../core/jwt";
import { userModel } from "../models/user.model";
import { chatSocketHandler } from "./chat.socket";
import { callSocketHandler } from "./call.socket";
import { followSocketHandler } from "./follow.socket";

export const setupSocket = (server: any) => {
  const allowedOrigins = (env.CORS_ORIGINS as string || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Socket.io CORS: Origin not allowed"));
      },
      credentials: true,
    },
  });


  connectRedis().then(async (isConnected) => {
    if (isConnected) {
      try {
        const { createAdapter } = await import("@socket.io/redis-adapter");
        io.adapter(createAdapter(pubClient, subClient));
        console.log("Socket.io using Redis adapter (scalable).");
      } catch {
        console.warn("@socket.io/redis-adapter not installed. Using in-memory adapter.");
      }
    } else {
      console.warn("Socket.io using in-memory adapter (single-server mode).");
    }
  });


  io.use(async (socket, next) => {
    console.log("Socket: Middleware - Auth check...");
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        console.warn("Socket: No token provided");
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = verifyAccessToken(token);
      const user = await userModel.findById(decoded.userId).select("-password");

      if (!user) {
        console.warn("Socket: User not found for token");
        return next(new Error("Authentication error: User not found"));
      }

      (socket as any).user = user;
      console.log(`Socket: Authenticated user ${user.firstName} (${user._id})`);
      next();
    } catch (err: any) {
      console.error("Socket: Authentication failed:", err.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    console.log(`Socket: Connection established: ${user.firstName} [${socket.id}]`);

    socket.join(user._id.toString());
    console.log(`Socket: User ${user._id} joined room ${user._id.toString()}`);

    chatSocketHandler(io, socket);
    callSocketHandler(io, socket);
    followSocketHandler(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket: User disconnected: ${user.firstName} - Reason: ${reason}`);
    });
  });

  return io;
};
