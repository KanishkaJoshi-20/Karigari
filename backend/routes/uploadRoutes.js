import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }
  cb(new Error("Only image files are allowed"), false);
};

const upload = multer({ storage, fileFilter });

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  // Return path the frontend can persist against product.image.
  res.status(201).json({
    message: "Image uploaded",
    image: `/uploads/${req.file.filename}`,
  });
});

export default router;
