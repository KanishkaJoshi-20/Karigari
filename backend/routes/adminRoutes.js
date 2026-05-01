import express from "express";
import User from "../models/user.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { validateLogin } from "../validators/userValidators.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/login", validateLogin, validate, asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const adminUser = await User.findOne({ email, isAdmin: true });
  if (!adminUser || !(await adminUser.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  res.json({
    _id: adminUser._id,
    name: adminUser.name,
    email: adminUser.email,
    isAdmin: adminUser.isAdmin,
    token: generateToken(adminUser._id),
  });
}));

// Get all users (admin only)
router.get("/users", protect, admin, asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
}));

export default router;
