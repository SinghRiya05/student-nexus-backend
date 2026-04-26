"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadImageToCloudinary = async (file) => {
    const compressedBuffer = await (0, sharp_1.default)(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    const base64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
    const result = await cloudinary_1.default.uploader.upload(base64, {
        folder: "student-nexus"
    });
    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};
exports.default = uploadImageToCloudinary;
