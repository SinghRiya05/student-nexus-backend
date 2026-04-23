import { Request, Response } from "express";
import { AuthService } from "../services/user.service";
import { userModel } from "../models/user.model";
import { sendAccessTokenCookie, sendRefreshTokenCookie, clearAccessTokenCookie, clearRefreshTokenCookie } from "../core/cookies";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import uploadImageToCloudinary from "../utils/cloudinaryUpload";

const authService = new AuthService();

export class AuthController {
    registerStepOne = catchAsync(async (req: Request, res: Response) => {
        const user = await authService.registerStepOne(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "Registration step one successful. Please verify your email.", user);
    });

    resendOtp = catchAsync(async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.resendOtp(email);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Verification OTP has been resent to your email.");
    });

    verifyEmail = catchAsync(async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        const ip = req.ip || "";
        const userAgent = req.headers["user-agent"] || "";
        const user = await authService.verifyEmail(email, otp, ip, userAgent);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Email verified successfully.", user);
    });

    login = catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const ip = req.ip || "";
        const userAgent = req.headers["user-agent"] || "";
        const { user, accessToken, refreshToken } = await authService.loginUser(email, password, ip, userAgent);
        sendAccessTokenCookie(res, accessToken);
        sendRefreshTokenCookie(res, refreshToken);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Login successful.", { user, accessToken, refreshToken });
    });

    completeRegistration = catchAsync(async (req: Request, res: Response) => {
        const { userId, ...registrationData } = req.body;
        const ip = req.ip || "";
        const userAgent = req.headers["user-agent"] || "";
        const { user, accessToken, refreshToken } = await authService.completeRegistration(userId, registrationData, ip, userAgent);
        sendAccessTokenCookie(res, accessToken);
        sendRefreshTokenCookie(res, refreshToken);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Registration completed successfully.", { user, accessToken, refreshToken });
    });

    refreshToken = catchAsync(async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken;
        const ip = req.ip || "";
        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token, ip);
        sendAccessTokenCookie(res, accessToken);
        sendRefreshTokenCookie(res, newRefreshToken);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Token refreshed successfully.", { accessToken, refreshToken: newRefreshToken });
    });

    logout = catchAsync(async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken;
        const ip = req.ip || "";
        await authService.logout(token, ip);
        clearAccessTokenCookie(res);
        clearRefreshTokenCookie(res);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Logout successful.");
    });

    deleteUser = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await authService.deleteUser(id as string);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "User deleted successfully.");
    });

    getAllUsers = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const users = await authService.getAllUsers(userId?.toString());
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Users fetched successfully.", users);
    });

    getMe = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const user = await authService.getMe(userId);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
    });

    getUserByEmail = catchAsync(async (req: Request, res: Response) => {
        const { email } = req.params;
        const user = await authService.getUserByEmail(email as string);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
    });

    getById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await authService.getById(id as string);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "User fetched successfully.", user);
    });

    togglePrivacy = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const user = await userModel.findById(userId);
        if (!user) throw new Error("User not found");
        user.isPrivate = !user.isPrivate;
        await user.save();
        sendResponse(res, STATUS_CODES.SUCCESS, true, `Account is now ${user.isPrivate ? "Private" : "Public"}.`, { isPrivate: user.isPrivate });
    });


    updateProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        if (!userId) throw new Error("Unauthorized");
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files?.avatar?.length) {
            const { url } = await uploadImageToCloudinary(files.avatar[0]);
            req.body.avatar = url;
        }
        if (files?.coverImage?.length) {
            const { url } = await uploadImageToCloudinary(files.coverImage[0]);
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
                    } catch {
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
        return sendResponse(
            res,
            STATUS_CODES.SUCCESS,
            true,
            "Profile updated successfully.",
            user
        );
    });

    getMutualFollowers = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const user = await authService.getMutualFollowers(userId.toString());
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Mutual followers fetched successfully.", user);
    });


    forgotPassword = catchAsync(async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.forgotPassword(email);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Reset OTP has been sent to your email.");
    });

    resetPassword = catchAsync(async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email, otp, newPassword);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Password has been reset successfully.");
    });

    verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        await authService.verifyResetOtp(email, otp);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Reset OTP verified successfully.");
    });
}
