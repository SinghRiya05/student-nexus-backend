"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/v1"));
const error_middleware_1 = require("./middlewares/error.middleware");
const responses_1 = require("./core/responses");
const env_1 = __importDefault(require("./core/env"));
const createUploadDirs_1 = require("./utils/createUploadDirs");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
(0, createUploadDirs_1.ensureUploadDirs)();
const allowedOrigins = (env_1.default.CORS_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);
const originsAllowed = (origin) => allowedOrigins.includes(origin);
app.use((req, res, next) => {
    res.setHeader("Vary", "Origin");
    next();
});
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (originsAllowed(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error('CORS policy violation: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204,
    maxAge: env_1.default.CORS_MAX_AGE,
}));
app.use((err, req, res, next) => {
    if (err.message === "CORS policy violation: Origin not allowed") {
        return (0, responses_1.sendErrorResponse)(res, 403, err.message);
    }
    next(err);
});
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use('/api/v1', v1_1.default);
// Serve test call page in development only
if (process.env.NODE_ENV === "dev") {
    app.get("/test-call", (_req, res) => {
        res.sendFile(path_1.default.join(process.cwd(), "test-call.html"));
    });
    app.get("/test-chat", (_req, res) => {
        res.sendFile(path_1.default.join(process.cwd(), "test-chat.html"));
    });
}
app.use(error_middleware_1.errorHandler);
exports.default = app;
