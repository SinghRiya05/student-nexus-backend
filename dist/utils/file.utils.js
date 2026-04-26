"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileIfExists = exports.getUploadPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getUploadPath = (category) => {
    return path_1.default.join("uploads", category);
};
exports.getUploadPath = getUploadPath;
const deleteFileIfExists = (filePath) => {
    if (!filePath)
        return;
    const normalizedPath = filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;
    const absolutePath = path_1.default.resolve(__dirname, "..", "..", normalizedPath);
    if (fs_1.default.existsSync(absolutePath)) {
        fs_1.default.unlinkSync(absolutePath);
    }
};
exports.deleteFileIfExists = deleteFileIfExists;
