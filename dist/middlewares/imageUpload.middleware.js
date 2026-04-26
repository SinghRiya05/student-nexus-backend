"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTo = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../core/errors");
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 * 1024;
const fileFilter = (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new errors_1.BadRequestError("Invalid file type"));
    }
    cb(null, true);
};
exports.uploadImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});
const uploadTo = (_category) => (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});
exports.uploadTo = uploadTo;
