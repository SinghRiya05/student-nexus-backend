import { userModel } from "../models/user.model";
import UserAuthCodeModel from "../models/user.authcode.model";
import { IUser } from "../interfaces/masterInterfaces/user.interface";
import RoleModel from "../models/role.model";
import { ConflictError, NotFoundError } from "../core/errors";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { renderTemplate } from "../utils/renderTemplate";
import { signAccessToken } from "../core/jwt";
import bcrypt from "bcrypt";

export class AuthService {

    registerUser = async (userData: IUser) => {
        const { email, roleId } = userData;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) throw new Error("User already exists");
        const role = await RoleModel.findById(roleId);
        if (!role) throw new Error("Role not found");
        if (["ADMIN", "SUPER_ADMIN"].includes(role.name)) throw new ConflictError("Invalid role selection");
        const user = await userModel.create({
            ...userData,
            verificationStatus: false
        });
        const otp = crypto.randomInt(100000, 999999).toString();
        await UserAuthCodeModel.deleteMany({
            userId: user._id,
            purpose: "VERIFY_EMAIL"
        });
        await UserAuthCodeModel.create({
            userId: user._id,
            code: otp,
            purpose: "VERIFY_EMAIL",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            isUsed: false
        });
        try {
            await sendEmail({
                to: email,
                subject: "Verify your email",
                html: renderTemplate("otp-verification", {
                    firstName: user.firstName,
                    otp: otp,
                    expiryMinutes: 10,
                    year: new Date().getFullYear(),
                    appName: "Student Nexus"
                }),
                text: `Hello ${user.firstName}, Your OTP is ${otp}. It will expire in 10 minutes.`
            })
        } catch (error) {
            console.error("Failed to send verification email:", error);
        }
        return user;
    }

    verifyEmail = async (email: string, otp: string) => {
        const user = await userModel.findOne({ email });
        if (!user) throw new Error("User not found");
        const authCode = await UserAuthCodeModel.findOne({
            userId: user._id,
            code: otp,
            purpose: "VERIFY_EMAIL",
            isUsed: false
        });
        if (!authCode) throw new Error("Invalid or expired OTP");
        authCode.isUsed = true;
        await authCode.save();
        user.verificationStatus = true;
        await user.save();
        const accessToken = signAccessToken({ userId: user._id })
        return { user, accessToken };
    }

    loginUser = async (email: string, password: string) => {
        const user = await userModel.findOne({ email });
        if (!user) throw new Error("User not found");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");
        if (!user.verificationStatus) throw new Error("User not verified");

        const accessToken = signAccessToken({ userId: user._id })
        return { user, accessToken };
    }
}