"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const config_1 = require("../config");
const CURRENT_ENV = process.env.NODE_ENV?.toLowerCase().trim() || config_1.NODEENV.DEV;
if (config_1.NODEENV.DEV.toLowerCase().trim() == CURRENT_ENV) {
    dotenv_1.default.config({ path: ".env" });
}
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["dev", "prod", "test"]),
    PORT: zod_1.z.coerce.number().min(1).max(65535),
    DB_URL: zod_1.z.string().min(1, "DB_URL is required"),
    CORS_ORIGINS: zod_1.z.string().min(1),
    CORS_MAX_AGE: zod_1.z.coerce.number().min(0),
    DB_POOL_MIN: zod_1.z.coerce.number().min(1).max(50),
    DB_POOL_MAX: zod_1.z.coerce.number().min(1).max(100),
    SERVER_SELECTION_TIMEOUT_MS: zod_1.z.coerce.number().min(1000),
    SOCKET_TIMEOUT_MS: zod_1.z.coerce.number().min(1000),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(10),
    ACCESS_TOKEN_EXPIRES: zod_1.z.string().min(1),
    REFRESH_TOKEN_EXPIRES: zod_1.z.string().min(1),
    COOKIE_SECURE: zod_1.z
        .string()
        .transform((val) => val === "true"),
    COOKIE_SAMESITE: zod_1.z.enum(["lax", "strict", "none"]),
    MAIL_HOST: zod_1.z.string().min(1),
    MAIL_PORT: zod_1.z.coerce.number().min(1).max(65535),
    MAIL_USER: zod_1.z.string().email(),
    MAIL_PASS: zod_1.z.string().min(6),
    MAIL_FROM_NAME: zod_1.z.string().default("Student Nexus"),
    FRONTEND_URL: zod_1.z.string().url(),
    REDIS_HOST: zod_1.z.string().default("127.0.0.1"),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    OPENAI_API_KEY: zod_1.z.string().min(1),
});
const env = envSchema.parse(process.env);
exports.default = env;
