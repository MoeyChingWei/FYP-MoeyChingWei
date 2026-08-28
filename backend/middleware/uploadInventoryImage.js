import fs from "fs";
import path from "path";
import multer from "multer";

const inventoryImagesDir = path.join(process.cwd(), "uploads", "inventory");
fs.mkdirSync(inventoryImagesDir, { recursive: true });

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, inventoryImagesDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${allowedExtensions.has(extension) ? extension : ".jpg"}`);
  },
});

export const uploadInventoryImageMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) callback(null, true);
    else callback(new Error("Only image files are allowed"));
  },
});
