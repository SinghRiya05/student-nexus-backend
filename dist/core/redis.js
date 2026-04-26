"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.subClient = exports.pubClient = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("./env"));
const redisOptions = {
    host: env_1.default.REDIS_HOST,
    port: env_1.default.REDIS_PORT,
    lazyConnect: true, // Don't connect immediately on import
    maxRetriesPerRequest: null, // Disable max-retries crash
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) {
            console.warn("Redis unavailable after 3 retries. Continuing without Redis.");
            return null; // Stop retrying — don't crash the server
        }
        return Math.min(times * 200, 2000);
    },
};
// Main Redis client for caching
exports.redis = new ioredis_1.default(redisOptions);
// Pub/Sub clients for Socket.io adapter
exports.pubClient = new ioredis_1.default(redisOptions);
exports.subClient = exports.pubClient.duplicate();
// Attach error handlers to prevent unhandled error crashes
exports.redis.on("error", (error) => {
    console.warn("Redis main client error:", error.message);
});
exports.pubClient.on("error", (error) => {
    console.warn("Redis pub client error:", error.message);
});
exports.subClient.on("error", (error) => {
    console.warn("Redis sub client error:", error.message);
});
exports.redis.on("connect", () => {
    console.log("Redis connected successfully.");
});
/**
 * Attempt to connect Redis.
 * Returns true if connected, false if unavailable.
 */
const connectRedis = async () => {
    try {
        await exports.redis.connect();
        await exports.pubClient.connect();
        await exports.subClient.connect();
        console.log("Redis pub/sub clients connected.");
        return true;
    }
    catch {
        console.warn("Redis is not available. Falling back to in-memory Socket.io adapter.");
        return false;
    }
};
exports.connectRedis = connectRedis;
