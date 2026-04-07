import dotenv from "dotenv";
import { z } from "zod";
import { NODEENV } from "../config";

const CURRENT_ENV =
  (process.env.NODE_ENV as NODEENV)?.toLowerCase().trim() || NODEENV.DEV;

if (NODEENV.DEV.toLowerCase().trim() == CURRENT_ENV) {
  dotenv.config({ path: ".env.development" });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]),

  PORT: z.coerce.number().min(1).max(65535),

  DB_URL: z.string().min(1, "DB_URL is required"),

  CORS_ORIGINS: z.string().min(1),
  CORS_MAX_AGE: z.coerce.number().min(0),

  DB_POOL_MIN: z.coerce.number().min(1).max(50),
  DB_POOL_MAX: z.coerce.number().min(1).max(100),

  SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().min(1000),
  SOCKET_TIMEOUT_MS: z.coerce.number().min(1000),

  JWT_SECRET: z.string().min(10),
  ACCESS_TOKEN_EXPIRES: z.string().min(1),
  REFRESH_TOKEN_EXPIRES: z.string().min(1),

  COOKIE_SECURE: z
    .string()
    .transform((val) => val === "true"),

  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().min(1).max(65535),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string().min(6),
  MAIL_FROM_NAME: z.string().default("Student Nexus"),

  FRONTEND_URL: z.string().url(),
  
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().default(6379),
});

const env = envSchema.parse(process.env);

export default env;