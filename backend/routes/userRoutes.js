import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} from "../validators/userValidators.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", validateRegister, validate, registerUser);
router.post("/login", validateLogin, validate, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validateProfileUpdate, validate, updateUserProfile);

export default router;
