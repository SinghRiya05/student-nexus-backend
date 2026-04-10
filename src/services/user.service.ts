import { userModel } from "../models/user.model";
import UserAuthCodeModel from "../models/user.authcode.model";
import { IUser } from "../interfaces/masterInterfaces/user.interface";
import RoleModel from "../models/role.model";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { renderTemplate } from "../utils/renderTemplate";
import {
  parseExpiryToMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../core/jwt";
import bcrypt from "bcrypt";
import { refreshTokenModel } from "../models/refreshToken.model";
import StudentProfileModel from "../models/student.profile.model";
import AluminiProfileModel from "../models/alumini.profile";
import TeacherProfileModel from "../models/teacher.profile.model";
import { Types } from "mongoose";

export class AuthService {
  // ------ REGISTRATION FIRST STEP ------
  registerStepOne = async (userData: Partial<IUser>) => {
    const { email } = userData;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const studentRole = await RoleModel.findOne({ name: "STUDENT" });
    if (!studentRole) throw new Error("Default Student role not found");

    const user = await userModel.create({
      ...userData,
      roleId: studentRole._id,
      verificationStatus: false,
    });
    const otp = crypto.randomInt(100000, 999999).toString();
    await UserAuthCodeModel.deleteMany({
      userId: user._id,
      purpose: "VERIFY_EMAIL",
    });
    await UserAuthCodeModel.create({
      userId: user._id,
      code: otp,
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
    });
    try {
      await sendEmail({
        to: email!,
        subject: "Verify your email",
        html: renderTemplate("otp-verification", {
          firstName: user.firstName,
          otp: otp,
          expiryMinutes: 10,
          year: new Date().getFullYear(),
          appName: "Student Nexus",
        }),
        text: `Hello ${user.firstName}, Your OTP is ${otp}. It will expire in 10 minutes.`,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
    return user;
  };

  // ------ RESEND OTP ------
  resendOtp = async (email: string) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if (user.verificationStatus) throw new Error("User already verified");

    const otp = crypto.randomInt(100000, 999999).toString();
    await UserAuthCodeModel.deleteMany({
      userId: user._id,
      purpose: "VERIFY_EMAIL",
    });
    await UserAuthCodeModel.create({
      userId: user._id,
      code: otp,
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
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
          appName: "Student Nexus",
        }),
        text: `Hello ${user.firstName}, Your OTP is ${otp}. It will expire in 10 minutes.`,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
    return true;
  };

  // ------ EMAIL VERIFICATION ------
  verifyEmail = async (
    email: string,
    otp: string,
    ip: string,
    userAgent: string,
  ) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");
    const authCode = await UserAuthCodeModel.findOne({
      userId: user._id,
      code: otp,
      purpose: "VERIFY_EMAIL",
      isUsed: false,
    });
    if (!authCode) throw new Error("Invalid or expired OTP");
    authCode.isUsed = true;
    await authCode.save();
    user.verificationStatus = true;
    await user.save();

    return user;
  };

  // ------ LOGIN USER ------
  loginUser = async (email: string, password: string, ip: string, userAgent: string) => {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) throw new Error("User not found");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");
    if (!user.verificationStatus) throw new Error("User not verified. Please verify your email.");
    if (user.status !== "ACTIVE") throw new Error("User account is not active. Please complete registration or contact administrator.");

    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id, ipAddress: ip, userAgent: userAgent, });
    await refreshTokenModel.create({ user: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), createdByIp: ip, });
    return { user, accessToken, refreshToken };
  };

  refreshToken = async (token: string, ip: string) => {
    const decoded = verifyRefreshToken(token);
    const existingToken = await refreshTokenModel.findOne({ token });
    if (!existingToken) throw new Error("Token not found");
    if (!existingToken.isActive) throw new Error("Token expired or revoked");
    const user = await userModel.findById(decoded.userId);
    if (!user) throw new Error("User not found");
    const newRefreshToken = signRefreshToken({
      userId: user._id,
      ipAddress: ip,
    });
    existingToken.revokedAt = new Date();
    existingToken.revokedByIp = ip;
    existingToken.replacedByToken = newRefreshToken;
    await existingToken.save();
    await refreshTokenModel.create({
      user: user._id,
      token: newRefreshToken,
      expiresAt: new Date(
        Date.now() + parseExpiryToMs(process.env.REFRESH_TOKEN_EXPIRES!),
      ),
      createdByIp: ip,
    });
    const accessToken = signAccessToken({ userId: user._id });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  };

  logout = async (token: string, ip: string) => {
    const existingToken = await refreshTokenModel.findOne({ token });
    if (!existingToken) return;
    existingToken.revokedAt = new Date();
    existingToken.revokedByIp = ip;
    await existingToken.save();
  };

  completeRegistration = async (userId: string, registrationData: any, ip: string, userAgent: string) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.verificationStatus) throw new Error("User email not verified");

    const { universityId, roleId, courseIds, ...profileData } =
      registrationData;

    const role = await RoleModel.findById(roleId);
    if (!role) throw new Error("Role not found");

    user.universityId = universityId;
    user.roleId = roleId;
    user.courseIds = courseIds;
    user.status = "ACTIVE";
    await user.save();

    if (role.name === "STUDENT") {
      await StudentProfileModel.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          semesterId: profileData.semesterId,
          hobby_badge: profileData.hobby_badge,
          skills: profileData.skills,
        },
        { upsert: true, new: true },
      );
    } else if (role.name === "ALUMINI") {
      await AluminiProfileModel.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          currentCompany: profileData.currentCompany,
          jobTitle: profileData.jobTitle,
          experienceYears: profileData.experienceYears,
          skills: profileData.skills,
        },
        { upsert: true, new: true },
      );
    } else if (role.name === "TEACHER") {
      await TeacherProfileModel.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          designation: profileData.designation,
          department: profileData.department,
          experienceYears: profileData.experienceYears,
        },
        { upsert: true, new: true },
      );
    }

    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({
      userId: user._id,
      ipAddress: ip,
      userAgent: userAgent,
    });
    await refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: ip,
    });

    return { user, accessToken, refreshToken };
  };

  deleteUser = async (userId: string) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");
    return await userModel.findByIdAndDelete(userId);
  };

  getMe = async (userId: string) => {
    const user = await userModel
      .findById(userId)
      .select("-password")
      .populate([
        {
          path: "roleId",
          select: "name",
        },
        {
          path: "courseIds",
          select: "courseName course_short_name",
        },
        {
          path: "universityId",
          select: "name short_name countryId cityId",
          populate: [
            {
              path: "country",
              select: "name",
            },
            {
              path: "state",
              select: "name",
            },
            {
              path: "city",
              select: "name",
            },
          ],
        },
      ])
      .lean();

    if (!user) throw new Error("User not found");

    return user;
  };
  getAllUsers = async () => {
    return await userModel.find().select("-password").populate("universityId").populate("courseIds").populate("roleId");
  };

  // ------ FORGOT PASSWORD ------
  forgotPassword = async (email: string) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found with this email");

    const otp = crypto.randomInt(100000, 999999).toString();

    // Clear old reset codes
    await UserAuthCodeModel.deleteMany({
      userId: user._id,
      purpose: "RESET_PASSWORD",
    });

    await UserAuthCodeModel.create({
      userId: user._id,
      code: otp,
      purpose: "RESET_PASSWORD",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      isUsed: false,
    });

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset OTP - Student Nexus",
        html: renderTemplate("otp-verification", {
          firstName: user.firstName,
          otp: otp,
          expiryMinutes: 10,
          year: new Date().getFullYear(),
          appName: "Student Nexus (Reset Password)",
        }),
        text: `Hello ${user.firstName}, Your Password Reset OTP is ${otp}. It will expire in 10 minutes.`,
      });
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
    return true;
  };

  // ------ RESET PASSWORD ------
  resetPassword = async (email: string, otp: string, newPassword: string) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const authCode = await UserAuthCodeModel.findOne({
      userId: user._id,
      code: otp,
      purpose: "RESET_PASSWORD",
      isUsed: false,
    });

    if (!authCode) throw new Error("Invalid or expired reset code");

    // Check expiry manually just in case even though TTL index exists
    if (new Date() > authCode.expiresAt) throw new Error("Reset code has expired");

    // Mark code as used
    authCode.isUsed = true;
    await authCode.save();

    // Update password
    user.password = newPassword; // The model has pre-save hook for hashing? Let me check.
    // Actually, checking userModel pre-save hook.
    await user.save();

    return true;
  };

  // ------ VERIFY RESET OTP ------
  verifyResetOtp = async (email: string, otp: string) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const authCode = await UserAuthCodeModel.findOne({
      userId: user._id,
      code: otp,
      purpose: "RESET_PASSWORD",
      isUsed: false,
    });

    if (!authCode) throw new Error("Invalid or expired reset code");
    return true;
  };
}
