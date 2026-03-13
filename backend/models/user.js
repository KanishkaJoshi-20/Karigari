import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null, // Allow null for OAuth users
      minlength: [6, "Password must be at least 6 characters"],
    },
    // OAuth fields
    googleId: {
      type: String,
      default: null,
      sparse: true, // Allow multiple nulls
    },
    oauthProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only when it changes and is not from OAuth
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  // Skip hashing if password is null (OAuth user)
  if (this.password === null) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;