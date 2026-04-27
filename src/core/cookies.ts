import { Response } from "express";
import env from "./env";
import { parseExpiryToMs } from "./jwt";

const isProduction = env.NODE_ENV === "prod";

export function sendRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: env.COOKIE_DOMAIN,
    maxAge: parseExpiryToMs(env.REFRESH_TOKEN_EXPIRES),
    path: "/",
  });
}

export function sendAccessTokenCookie(res: Response, token: string) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: env.COOKIE_DOMAIN,
    maxAge: parseExpiryToMs(env.ACCESS_TOKEN_EXPIRES),
    path: "/",
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/",
  });
}

export function clearAccessTokenCookie(res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/",
  });
}