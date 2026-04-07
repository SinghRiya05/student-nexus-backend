import { Server } from "socket.io";
import { pubClient, subClient, connectRedis } from "../core/redis";
import env from "../core/env";
import { verifyAccessToken } from "../core/jwt";
import { userModel } from "../models/user.model";
import { chatSocketHandler } from "./chat.socket";
import { callSocketHandler } from "./call.socket";

export const setupSocket = (server: any) => {
  const allowedOrigins = (env.CORS_ORIGINS as string || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (file://, Postman, mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Socket.io CORS: Origin not allowed"));
      },
      credentials: true,
    },
  });

  // Connect Redis and set adapter — dynamic import so server doesn't crash if package is missing
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

  // JWT Authentication Middleware for Sockets
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = verifyAccessToken(token);
      const user = await userModel.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      (socket as any).user = user;
      next();
    } catch {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.firstName} [${socket.id}]`);

    // Join personal room to receive private notifications
    socket.join(user._id.toString());

    // Register feature handlers
    chatSocketHandler(io, socket);
    callSocketHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.firstName}`);
    });
  });

  return io;
};
