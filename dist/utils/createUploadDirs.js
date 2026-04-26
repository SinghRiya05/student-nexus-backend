"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUploadDirs = void 0;
const fs_1 = __importDefault(require("fs"));
const ensureUploadDirs = () => {
    const dirs = ["uploads", "uploads/chat"];
    dirs.forEach((dir) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
        }
    });
};
exports.ensureUploadDirs = ensureUploadDirs;
