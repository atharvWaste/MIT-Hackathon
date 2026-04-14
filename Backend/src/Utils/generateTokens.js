import jwt from "jsonwebtoken";
 
// ────────────────────────────────────────  Token Generators ─────────────────────────────────────────────────────────
export const generateAccessToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
 
export const generateRefreshToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
 
// ──────────────────────────────────────── Cookie Options ───────────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === "production";
 
export const accessTokenCookieOptions = {
  httpOnly: true,                  
  secure: isProduction,            
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 15 * 60 * 1000,          
};
 
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};
 
// ──────────────────────────────────── generate both tokens, set both cookies, return tokens ────────────
export const issueTokensAndSetCookies = (res, userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
 
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
 
  return { accessToken, refreshToken };
};