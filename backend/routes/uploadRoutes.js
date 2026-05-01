import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  // Cloudinary stores the file's secure URL in req.file.path
  res.status(201).json({
    message: "Image uploaded successfully",
    image: req.file.path || req.file.secure_url || req.file.url,
  });
});

// Generic error handler inside the route for multer errors
router.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
});

export default router;
