"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.parseExpiryToMs = parseExpiryToMs;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("./ApiError");
const env_1 = __importDefault(require("./env"));
if (!env_1.default.JWT_SECRET) {
    throw new ApiError_1.ApiError("JWT secrets are not defined", 400);
}
// ---- Expiry (FIXED TYPE) ----
const ACCESS_EXPIRES = env_1.default.ACCESS_TOKEN_EXPIRES;
const REFRESH_EXPIRES = env_1.default.REFRESH_TOKEN_EXPIRES;
// ---------- ACCESS TOKEN ----------
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_SECRET, {
        expiresIn: ACCESS_EXPIRES,
    });
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
    }
    catch {
        throw new ApiError_1.ApiError("Invalid or expired access token", 401);
    }
}
// ---------- REFRESH TOKEN ----------
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_SECRET, {
        expiresIn: REFRESH_EXPIRES,
    });
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
    }
    catch {
        throw new ApiError_1.ApiError("Invalid or expired refresh token", 401);
    }
}
// ---------- EXPIRY ----------
function parseExpiryToMs(exp) {
    if (!exp)
        return 30 * 24 * 60 * 60 * 1000;
    const trimmedExp = exp.trim().toLowerCase();
    const num = parseInt(trimmedExp.slice(0, -1));
    const unit = trimmedExp.slice(-1);
    if (isNaN(num))
        return 30 * 24 * 60 * 60 * 1000;
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
