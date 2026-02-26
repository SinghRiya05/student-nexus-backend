import { Response } from "express";
import env from "./env";
import { parseExpiryToMs } from "./jwt";

const isProduction = env.NODE_ENV === "prod";

export function sendRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseExpiryToMs(env.REFRESH_TOKEN_EXPIRES),
    path: "/",
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}