
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

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

ensureUploadDirs();

const allowedOrigins = (env.CORS_ORIGINS as string || '').split(',').map(origin => origin.trim()).filter(Boolean);
const originsAllowed = (origin: string) => allowedOrigins.includes(origin);

app.use((req, res, next) => {
    res.setHeader("Vary", "Origin");
    next();
})

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(originsAllowed(origin)) {
            return callback(null, true);
        }else {
            return callback(new Error('CORS policy violation: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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
app.use(errorHandler);

export default app;