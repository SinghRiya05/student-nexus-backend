import fs from "fs";

export const ensureUploadDirs = () => {
  const dirs = ["uploads", "uploads/chat"];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};