import fs from "fs";

export const ensureUploadDirs = () => {
  const dirs = ["uploads", "uploads/images"];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};