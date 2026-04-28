
import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import apiRoutes from "./routes/v1";
import { errorHandler } from "./middlewares/error.middleware";
import { sendErrorResponse } from "./core/responses";
import env from "./core/env";
import { ensureUploadDirs } from "./utils/createUploadDirs";


const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

ensureUploadDirs();

const allowedOrigins = (env.CORS_ORIGINS as string || '').split(',').map(origin => origin.trim().toLowerCase()).filter(Boolean);
const originsAllowed = (origin: string) => {
  const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
  if (allowedOrigins.includes(normalizedOrigin)) return true;
  // Fallback for production domains and subdomains
  if (normalizedOrigin.endsWith('factglint.com')) return true;
  return false;
};

app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
})

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (originsAllowed(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Auth-Token'],
  optionsSuccessStatus: 204,
  maxAge: env.CORS_MAX_AGE,
}));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === "CORS policy violation: Origin not allowed") {
    return sendErrorResponse(res, 403, err.message);
  }
  next(err);
}
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/api/v1', apiRoutes);

// Serve test call page in development only
if (process.env.NODE_ENV === "dev") {
  app.get("/test-call", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "test-call.html"));
  });
  app.get("/test-chat", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "test-chat.html"));
  });
}

app.use(errorHandler);

export default app;