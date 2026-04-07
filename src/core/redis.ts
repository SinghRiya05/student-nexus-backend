import Redis from "ioredis";
import env from "./env";

const redisOptions = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    lazyConnect: true,            // Don't connect immediately on import
    maxRetriesPerRequest: null,   // Disable max-retries crash
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
        if (times > 3) {
            console.warn("Redis unavailable after 3 retries. Continuing without Redis.");
            return null;          // Stop retrying — don't crash the server
        }
        return Math.min(times * 200, 2000);
    },
};

// Main Redis client for caching
export const redis = new Redis(redisOptions);

// Pub/Sub clients for Socket.io adapter
export const pubClient = new Redis(redisOptions);
export const subClient = pubClient.duplicate();

// Attach error handlers to prevent unhandled error crashes
redis.on("error", (error) => {
    console.warn("Redis main client error:", error.message);
});
pubClient.on("error", (error) => {
    console.warn("Redis pub client error:", error.message);
});
subClient.on("error", (error) => {
    console.warn("Redis sub client error:", error.message);
});

redis.on("connect", () => {
    console.log("Redis connected successfully.");
});

/**
 * Attempt to connect Redis.
 * Returns true if connected, false if unavailable.
 */
export const connectRedis = async (): Promise<boolean> => {
    try {
        await redis.connect();
        await pubClient.connect();
        await subClient.connect();
        console.log("Redis pub/sub clients connected.");
        return true;
    } catch {
        console.warn("Redis is not available. Falling back to in-memory Socket.io adapter.");
        return false;
    }
};
