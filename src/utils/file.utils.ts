import fs from "fs";
import path from "path";

export const getUploadPath = (category: string) => {
  return path.join("uploads", category);
};

export const deleteFileIfExists = (filePath?: string) => {
  if (!filePath) return;

  const normalizedPath = filePath.startsWith("/")
    ? filePath.slice(1)
    : filePath;
  const absolutePath = path.resolve(__dirname, "..", "..", normalizedPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};