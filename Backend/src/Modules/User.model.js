import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, 
    },

    // ─── Email Verification ───────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      select: false,
    },
    emailVerifyExpiry: {
      type: Date,
      select: false,
    },

    // ─── Refresh Token (stored hashed) ───────────────────────────────────────
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);
// 👆MODIFICATION NEEDED, Done till form only
// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method:-generate email verification token ──────────────────────
userSchema.methods.generateEmailVerifyToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiryHours = Number(process.env.EMAIL_VERIFY_EXPIRY_HOURS) || 24;
  this.emailVerifyExpiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  return rawToken;
};

const User = mongoose.model("User", userSchema);
export default User;