import multer from "multer";
import { BadRequestError } from "../core/errors";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp"
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const fileFilter: multer.Options["fileFilter"] =
  (_req, file, cb) => {

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestError("Invalid file type")
      );
    }

    cb(null, true);
  };

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadTo = (_category: string) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
  });