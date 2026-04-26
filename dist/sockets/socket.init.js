"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const redis_1 = require("../core/redis");
const env_1 = __importDefault(require("../core/env"));
const jwt_1 = require("../core/jwt");
const user_model_1 = require("../models/user.model");
const chat_socket_1 = require("./chat.socket");
const call_socket_1 = require("./call.socket");
const follow_socket_1 = require("./follow.socket");
const setupSocket = (server) => {
    const allowedOrigins = (env_1.default.CORS_ORIGINS || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                if (allowedOrigins.includes(origin))
                    return callback(null, true);
                return callback(new Error("Socket.io CORS: Origin not allowed"));
            },
            credentials: true,
        },
    });
    (0, redis_1.connectRedis)().then(async (isConnected) => {
        if (isConnected) {
            try {
                const { createAdapter } = await Promise.resolve().then(() => __importStar(require("@socket.io/redis-adapter")));
                io.adapter(createAdapter(redis_1.pubClient, redis_1.subClient));
                console.log("Socket.io using Redis adapter (scalable).");
            }
            catch {
                console.warn("@socket.io/redis-adapter not installed. Using in-memory adapter.");
            }
        }
        else {
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
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            const user = await user_model_1.userModel.findById(decoded.userId).select("-password");
            if (!user) {
                console.warn("Socket: User not found for token");
                return next(new Error("Authentication error: User not found"));
            }
            socket.user = user;
            console.log(`Socket: Authenticated user ${user.firstName} (${user._id})`);
            next();
        }
        catch (err) {
            console.error("Socket: Authentication failed:", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.user;
        console.log(`Socket: Connection established: ${user.firstName} [${socket.id}]`);
        socket.join(user._id.toString());
        console.log(`Socket: User ${user._id} joined room ${user._id.toString()}`);
        (0, chat_socket_1.chatSocketHandler)(io, socket);
        (0, call_socket_1.callSocketHandler)(io, socket);
        (0, follow_socket_1.followSocketHandler)(io, socket);
        socket.on("disconnect", (reason) => {
            console.log(`Socket: User disconnected: ${user.firstName} - Reason: ${reason}`);
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
