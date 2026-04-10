import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";
import { registerSchema, loginSchema, verifyEmailSchema, completeRegistrationSchema, resendOtpSchema } from "../../validations/auth.validation";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", validateRequest(registerSchema), authController.registerStepOne);
authRouter.post("/resend-otp", validateRequest(resendOtpSchema), authController.resendOtp);
authRouter.post("/verify-email", validateRequest(verifyEmailSchema), authController.verifyEmail);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post("/complete-registration", validateRequest(completeRegistrationSchema), authController.completeRegistration);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.delete("/delete-user/:id", authController.deleteUser);
authRouter.get("/get-all-users", authMiddleware, authController.getAllUsers);
authRouter.get("/get-user-by-email/:email", authController.getUserByEmail);
authRouter.patch("/toggle-privacy", authMiddleware, authController.togglePrivacy);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/verify-reset-otp", authController.verifyResetOtp);

export default authRouter;
