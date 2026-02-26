import fs from "fs";
import path from "path";

export const deleteFileIfExists = (filePath?: string) => {
  if (!filePath) return;

  const normalizedPath = filePath.startsWith("/")
    ? filePath.slice(1)
    : filePath;
  const absolutePath = path.resolve(__dirname, "..", "..", normalizedPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    return;
  }

  if (normalizedPath.includes("uploads/countries/")) {
    const legacyPath = normalizedPath.replace(
      "uploads/countries/",
      "uploads/cities/"
    );
    const legacyAbsolutePath = path.resolve(__dirname, "..", "..", legacyPath);

    if (fs.existsSync(legacyAbsolutePath)) {
      fs.unlinkSync(legacyAbsolutePath);
      return;
    }
  }
};