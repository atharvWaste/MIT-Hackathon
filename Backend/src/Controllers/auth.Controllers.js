import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { issueTokensAndSetCookies, refreshTokenCookieOptions, accessTokenCookieOptions } from "../utils/generateTokens.js";
import { sendVerificationEmail } from "../services/email.service.js";
import bcrypt from "bcryptjs";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SAFE_USER_FIELDS = "name email isVerified createdAt";

// ───────────────────────────────────────Rout POST /register ───────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = new User({ name, email, password });

  const rawToken = user.generateEmailVerifyToken();

  await user.save();

 
  sendVerificationEmail(user.email, user.name, rawToken).catch((err) =>
    console.error("Email send failed:", err.message)
  );

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Account created! Please verify your email."));
});

// ────────────────────────Rout GET /verify-email?token=... ─────────────────────────────────────────────
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) throw new ApiError(400, "Verification token is missing.");


  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerifyToken: hashed,
    emailVerifyExpiry: { $gt: Date.now() }, 
  }).select("+emailVerifyToken +emailVerifyExpiry");

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired. Please register again.");
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpiry = undefined;
  await user.save();

  return res.json(new ApiResponse(200, null, "Email verified successfully! You can now log in."));
});

// ─── POST /login ──────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.isPasswordCorrect(password))) {

    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const { refreshToken } = issueTokensAndSetCookies(res, user._id);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id).select(SAFE_USER_FIELDS);

  return res.json(new ApiResponse(200, { user: safeUser }, "Logged in successfully."));
});

// ───────────────────────────Rout POST /refresh ────────────────────────────────────────────────────────────
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing. Please log in.");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Refresh token expired or invalid. Please log in again.");
  }

  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid session. Please log in.");
  }


  const isMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
  if (!isMatch) {
    throw new ApiError(401, "Token mismatch. Possible session hijack detected.");
  }


  const { refreshToken: newRefreshToken } = issueTokensAndSetCookies(res, user._id);

  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(200, null, "Access token refreshed."));
});

// ─────────────────────────────────Rout POST /logout ─────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const clearOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  res.clearCookie("accessToken", clearOptions);
  res.clearCookie("refreshToken", clearOptions);

  return res.json(new ApiResponse(200, null, "Logged out successfully."));
});

// ──────────────────────────────Rout GET /me ─────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, { user: req.user }, "User fetched."));
});