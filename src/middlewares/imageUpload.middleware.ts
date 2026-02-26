import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "../core/errors";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      cb(null, `img-${uniqueSuffix}${ext}`);
    },
  });

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestError(
        "Invalid file type. Only JPG, PNG, JPEG, WEBP are allowed."
      )
    );
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage: createStorage("uploads/images"),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadTo = (folder: string) =>
  multer({
    storage: createStorage(folder),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  });