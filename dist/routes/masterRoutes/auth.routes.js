"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const imageUpload_middleware_1 = require("../../middlewares/imageUpload.middleware");
const auth_validation_1 = require("../../validations/auth.validation");
const user_validation_1 = require("../../validations/user.validation");
const authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
authRouter.post("/register", (0, validateRequest_1.validateRequest)(auth_validation_1.registerSchema), authController.registerStepOne);
authRouter.post("/resend-otp", (0, validateRequest_1.validateRequest)(auth_validation_1.resendOtpSchema), authController.resendOtp);
authRouter.post("/verify-email", (0, validateRequest_1.validateRequest)(auth_validation_1.verifyEmailSchema), authController.verifyEmail);
authRouter.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginSchema), authController.login);
authRouter.post("/complete-registration", (0, validateRequest_1.validateRequest)(auth_validation_1.completeRegistrationSchema), authController.completeRegistration);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authMiddleware_1.middleware, authController.logout);
authRouter.delete("/delete-user/:id", authController.deleteUser);
authRouter.get("/get-all-users", authMiddleware_1.middleware, authController.getAllUsers);
authRouter.get("/get-me", authMiddleware_1.middleware, authController.getMe);
authRouter.get("/getMutualFollowers", authMiddleware_1.middleware, authController.getMutualFollowers);
authRouter.get("/get-user-by-email/:email", authController.getUserByEmail);
authRouter.get("/get-by-id/:id", authMiddleware_1.middleware, authController.getById);
authRouter.patch("/toggle-privacy", authMiddleware_1.middleware, authController.togglePrivacy);
authRouter.patch("/update-profile", authMiddleware_1.middleware, (0, imageUpload_middleware_1.uploadTo)("profiles").fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]), (0, validateRequest_1.validateRequest)(user_validation_1.updateProfileSchema), authController.updateProfile);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/verify-reset-otp", authController.verifyResetOtp);
exports.default = authRouter;
