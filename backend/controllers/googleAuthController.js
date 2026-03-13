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
    const { id, emails, displayName, photos } = req.user;

    if (!emails || !emails.length) {
      res.status(400);
      throw new Error("Email not provided by Google");
    }

    const email = emails[0].value;
    const picture = photos && photos.length > 0 ? photos[0].value : null;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email }, { googleId: id }],
    });

    if (user) {
      // Update OAuth info if this is a new OAuth login for existing email-based user
      if (!user.googleId) {
        user.googleId = id;
        user.oauthProvider = "google";
        if (picture && !user.profilePicture) {
          user.profilePicture = picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: displayName || email.split("@")[0],
        email,
        googleId: id,
        oauthProvider: "google",
        profilePicture: picture,
        password: null,
      });
    }

    const token = generateToken(user._id);

    // Set user in session (optional, for maintaining session)
    req.user = user;

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(
      `${frontendUrl}/auth-success?token=${token}&email=${email}&name=${user.name}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/login?error=${error.message}`);
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