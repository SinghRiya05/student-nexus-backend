"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileTo = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("../core/errors");
const file_utils_1 = require("../utils/file.utils");
const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/zip",
    "application/x-zip-compressed",
    "text/plain",
    "text/csv",
    "application/rtf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for documents and zips
const createStorage = (folder) => multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs_1.default.existsSync(folder)) {
            fs_1.default.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `file-${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new errors_1.BadRequestError("Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, CSV, TXT, and RTF are allowed."));
    }
    cb(null, true);
};
const uploadFileTo = (category) => (0, multer_1.default)({
    storage: createStorage((0, file_utils_1.getUploadPath)(category)),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});
exports.uploadFileTo = uploadFileTo;
