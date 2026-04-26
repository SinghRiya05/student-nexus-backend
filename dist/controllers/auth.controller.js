"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../services/user.service");
const user_model_1 = require("../models/user.model");
const cookies_1 = require("../core/cookies");
const catchAsync_1 = require("../core/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const cloudinaryUpload_1 = __importDefault(require("../utils/cloudinaryUpload"));
const authService = new user_service_1.AuthService();
class AuthController {
    constructor() {
        this.registerStepOne = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = await authService.registerStepOne(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Registration step one successful. Please verify your email.", user);
        });
        this.resendOtp = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email } = req.body;
            await authService.resendOtp(email);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Verification OTP has been resent to your email.");
        });
        this.verifyEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, otp } = req.body;
            const ip = req.ip || "";
            const userAgent = req.headers["user-agent"] || "";
            const user = await authService.verifyEmail(email, otp, ip, userAgent);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Email verified successfully.", user);
        });
        this.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, password } = req.body;
            const ip = req.ip || "";
            const userAgent = req.headers["user-agent"] || "";
            const { user, accessToken, refreshToken } = await authService.loginUser(email, password, ip, userAgent);
            (0, cookies_1.sendAccessTokenCookie)(res, accessToken);
            (0, cookies_1.sendRefreshTokenCookie)(res, refreshToken);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Login successful.", { user, accessToken, refreshToken });
        });
        this.completeRegistration = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { userId, ...registrationData } = req.body;
            const ip = req.ip || "";
            const userAgent = req.headers["user-agent"] || "";
            const { user, accessToken, refreshToken } = await authService.completeRegistration(userId, registrationData, ip, userAgent);
            (0, cookies_1.sendAccessTokenCookie)(res, accessToken);
            (0, cookies_1.sendRefreshTokenCookie)(res, refreshToken);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Registration completed successfully.", { user, accessToken, refreshToken });
        });
        this.refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const token = req.cookies.refreshToken;
            const ip = req.ip || "";
            const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token, ip);
            (0, cookies_1.sendAccessTokenCookie)(res, accessToken);
            (0, cookies_1.sendRefreshTokenCookie)(res, newRefreshToken);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Token refreshed successfully.", { accessToken, refreshToken: newRefreshToken });
        });
        this.logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const token = req.cookies.refreshToken;
            const ip = req.ip || "";
            await authService.logout(token, ip);
            (0, cookies_1.clearAccessTokenCookie)(res);
            (0, cookies_1.clearRefreshTokenCookie)(res);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Logout successful.");
        });
        this.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            await authService.deleteUser(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "User deleted successfully.");
        });
        this.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const users = await authService.getAllUsers(userId?.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Users fetched successfully.", users);
        });
        this.getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const user = await authService.getMe(userId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
        });
        this.getUserByEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email } = req.params;
            const user = await authService.getUserByEmail(email);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
        });
        this.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const user = await authService.getById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
        });
        this.togglePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const user = await user_model_1.userModel.findById(userId);
            if (!user)
                throw new Error("User not found");
            user.isPrivate = !user.isPrivate;
            await user.save();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, `Account is now ${user.isPrivate ? "Private" : "Public"}.`, { isPrivate: user.isPrivate });
        });
        this.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            if (!userId)
                throw new Error("Unauthorized");
            const files = req.files;
            if (files?.avatar?.length) {
                const { url } = await (0, cloudinaryUpload_1.default)(files.avatar[0]);
                req.body.avatar = url;
            }
            if (files?.coverImage?.length) {
                const { url } = await (0, cloudinaryUpload_1.default)(files.coverImage[0]);
                req.body.coverImage = url;
            }
            const restrictedFields = ["email", "roleId"];
            restrictedFields.forEach((field) => {
                if (field in req.body) {
                    delete req.body[field];
                }
            });
            const arrayFields = ["courseIds", "skills", "projects"];
            arrayFields.forEach((field) => {
                let value = req.body[field];
                if (req.body[`${field}[]`]) {
                    value = req.body[`${field}[]`];
                    delete req.body[`${field}[]`];
                }
                if (value !== undefined) {
                    if (typeof value === "string") {
                        try {
                            const parsed = JSON.parse(value);
                            req.body[field] = Array.isArray(parsed) ? parsed : [parsed];
                        }
                        catch {
                            req.body[field] = [value];
                        }
                    }
                    else if (Array.isArray(value)) {
                        req.body[field] = value;
                    }
                    else {
                        req.body[field] = [value];
                    }
                }
            });
            ["universityId", "semesterId"].forEach((field) => {
                if (req.body[field] === "" || req.body[field] === "null" || req.body[field] === "undefined") {
                    delete req.body[field];
                }
            });
            const user = await authService.updateProfile(userId.toString(), req.body);
            return (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Profile updated successfully.", user);
        });
        this.getMutualFollowers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userId = req.user?._id;
            const user = await authService.getMutualFollowers(userId.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Mutual followers fetched successfully.", user);
        });
        this.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email } = req.body;
            await authService.forgotPassword(email);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Reset OTP has been sent to your email.");
        });
        this.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, otp, newPassword } = req.body;
            await authService.resetPassword(email, otp, newPassword);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Password has been reset successfully.");
        });
        this.verifyResetOtp = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, otp } = req.body;
            await authService.verifyResetOtp(email, otp);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Reset OTP verified successfully.");
        });
    }
}
exports.AuthController = AuthController;
