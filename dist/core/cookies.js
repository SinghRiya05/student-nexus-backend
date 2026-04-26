"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshTokenCookie = sendRefreshTokenCookie;
exports.sendAccessTokenCookie = sendAccessTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
exports.clearAccessTokenCookie = clearAccessTokenCookie;
const env_1 = __importDefault(require("./env"));
const jwt_1 = require("./jwt");
const isProduction = env_1.default.NODE_ENV === "prod";
function sendRefreshTokenCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: (0, jwt_1.parseExpiryToMs)(env_1.default.REFRESH_TOKEN_EXPIRES),
        path: "/",
    });
}
function sendAccessTokenCookie(res, token) {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: (0, jwt_1.parseExpiryToMs)(env_1.default.ACCESS_TOKEN_EXPIRES),
        path: "/",
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
}
function clearAccessTokenCookie(res) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
}
