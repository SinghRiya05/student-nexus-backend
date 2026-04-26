"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../core/env"));
const connectDB = async () => {
    try {
        mongoose_1.default.set("strictQuery", true);
        const conn = await mongoose_1.default.connect(env_1.default.DB_URL, {
            minPoolSize: env_1.default.DB_POOL_MIN,
            maxPoolSize: env_1.default.DB_POOL_MAX,
            serverSelectionTimeoutMS: env_1.default.SERVER_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: env_1.default.SOCKET_TIMEOUT_MS
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        console.log("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
};
exports.default = connectDB;
