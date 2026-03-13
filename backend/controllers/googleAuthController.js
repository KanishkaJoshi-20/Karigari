import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });

const userResponse = (user, token) => ({
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    postalCode: user.postalCode || "",
    country: user.country || "",
    profilePicture: user.profilePicture || "",
  },
  token,
});

export const googleAuthCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated from Google");
    }

    const { _id, email, name } = req.user;

    if (!email) {
      throw new Error(
        "Email not available. Please check your Google Account privacy settings and ensure email sharing is enabled."
      );
    }

    const token = generateToken(_id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // URL encode parameters to handle special characters
    const encodedEmail = encodeURIComponent(email);
    const encodedName = encodeURIComponent(name);
    const encodedToken = encodeURIComponent(token);

    res.redirect(
      `${frontendUrl}/auth-success?token=${encodedToken}&email=${encodedEmail}&name=${encodedName}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const encodedError = encodeURIComponent(error.message);
    res.redirect(`${frontendUrl}/login?error=${encodedError}`);
  }
};

export const getUserFromGoogle = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    res.json(userResponse(req.user, generateToken(req.user._id)));
  } catch (error) {
    next(error);
  }
};