import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "../core/errors";
import { getUploadPath } from "../utils/file.utils";

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

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB limit for documents and zips

const createStorage = (folder: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `file-${uniqueSuffix}${ext}`);
    },
  });

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestError(
        "Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, CSV, TXT, and RTF are allowed."
      )
    );
  }
  cb(null, true);
};

export const uploadFileTo = (category: string) =>
  multer({
    storage: createStorage(getUploadPath(category)),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  });
