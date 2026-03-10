import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });

router.post("/login", async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get("/users", protect, admin, async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
