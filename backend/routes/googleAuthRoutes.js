import express from "express";
import passport from "passport";
import { googleAuthCallback } from "../controllers/googleAuthController.js";

const router = express.Router();

// Initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=authentication_failed",
    session: false,
  }),
  googleAuthCallback
);

export default router;