import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

// Protected
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;