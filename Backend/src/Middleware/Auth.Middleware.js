import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Access denied. Please log in.");
  }

  let decoded;
  
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired. Please refresh your token.");
    }
    throw new ApiError(401, "Invalid token. Please log in again.");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = user; 
  next();
});