import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { Types } from "mongoose";
import { ApiError } from "./ApiError";
import env from "./env";

if (!env.JWT_SECRET) {
  throw new ApiError("JWT secrets are not defined", 400);
}

export interface AccessTokenPayload {
  userId: Types.ObjectId;
}

export interface RefreshTokenPayload {
  userId: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
}

export type VerifiedTokenPayload = JwtPayload & AccessTokenPayload;

// ---- Expiry (FIXED TYPE) ----
const ACCESS_EXPIRES: SignOptions["expiresIn"] = env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"];
const REFRESH_EXPIRES: SignOptions["expiresIn"] = env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"];

// ---------- ACCESS TOKEN ----------
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: ACCESS_EXPIRES,
  });
}

export function verifyAccessToken(token: string): VerifiedTokenPayload {
  try {
    return jwt.verify(
      token,
      env.JWT_SECRET as string
    ) as VerifiedTokenPayload;
  } catch {
    throw new ApiError("Invalid or expired access token", 401);
  }
}

// ---------- REFRESH TOKEN ----------
export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: REFRESH_EXPIRES,
  });
}

export function verifyRefreshToken(token: string): VerifiedTokenPayload {
  try {
    return jwt.verify(
      token,
      env.JWT_SECRET as string
    ) as VerifiedTokenPayload;
  } catch {
    throw new ApiError("Invalid or expired refresh token", 401);
  }
}

// ---------- EXPIRY ----------
export function parseExpiryToMs(exp: string): number {
  if (!exp) return 30 * 24 * 60 * 60 * 1000;

  const trimmedExp = exp.trim().toLowerCase();
  const num = parseInt(trimmedExp.slice(0, -1));
  const unit = trimmedExp.slice(-1);

  if (isNaN(num)) return 30 * 24 * 60 * 60 * 1000;

  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000;
  }
}