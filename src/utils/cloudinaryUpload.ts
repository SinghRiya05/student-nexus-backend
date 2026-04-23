import sharp from "sharp";
import cloudinary from "./cloudinary";

const uploadImageToCloudinary = async (file: any) => {

    const compressedBuffer = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    const base64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")
        }`;

    const result = await cloudinary.uploader.upload(base64, {
        folder: "student-nexus"
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};

export default uploadImageToCloudinary;