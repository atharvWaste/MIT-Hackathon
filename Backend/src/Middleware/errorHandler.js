import ApiError from "../utils/ApiError.js";
 
export const errorHandler = (err, req, res, next) => {
  // If it's our custom error, use its statusCode; otherwise 500
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
 
  // Hide internal details in production
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Something went wrong";
 
  // Log full error only in development
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode}:`, err);
  }
 
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};