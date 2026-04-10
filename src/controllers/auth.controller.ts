import { Request, Response } from "express";
import { AuthService } from "../services/user.service";
import { userModel } from "../models/user.model";
import { sendAccessTokenCookie, sendRefreshTokenCookie, clearAccessTokenCookie, clearRefreshTokenCookie } from "../core/cookies";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

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
        const users = await authService.getAllUsers();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Users fetched successfully.", users);
    });

    getMe = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const user = await authService.getMe(userId);
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
