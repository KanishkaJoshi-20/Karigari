import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
          // Get email - handle different email formats
          const email = (profile.emails && profile.emails.length > 0 
            ? profile.emails[0].value 
            : profile._json?.email || profile.email)?.toLowerCase();

          if (!email) {
            return done(
              new Error("Email not provided by Google. Please ensure email is public in your Google Account settings."), 
              null
            );
          }

          // Find or create user
          let user = await User.findOne({
            $or: [{ email }, { googleId: profile.id }],
          });

          if (!user) {
            const picture =
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null;

            user = await User.create({
              name: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              oauthProvider: "google",
              profilePicture: picture,
              password: null,
              isAdmin: email === adminEmail,
            });
          } else {
            // Update GoogleId if user previously registered with email
            if (!user.googleId) {
              user.googleId = profile.id;
              user.oauthProvider = "google";
              if (profile.photos && profile.photos.length > 0) {
                user.profilePicture = profile.photos[0].value;
              }
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user (store in session)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user (retrieve from session)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select("-password");
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};