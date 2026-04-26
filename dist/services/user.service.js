"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const user_authcode_model_1 = __importDefault(require("../models/user.authcode.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const sendEmail_1 = require("../utils/sendEmail");
const crypto_1 = __importDefault(require("crypto"));
const renderTemplate_1 = require("../utils/renderTemplate");
const file_utils_1 = require("../utils/file.utils");
const jwt_1 = require("../core/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const refreshToken_model_1 = require("../models/refreshToken.model");
const student_profile_model_1 = __importDefault(require("../models/student.profile.model"));
const alumini_profile_1 = __importDefault(require("../models/alumini.profile"));
const teacher_profile_model_1 = __importDefault(require("../models/teacher.profile.model"));
const follow_model_1 = require("../models/follow.model");
class AuthService {
    constructor() {
        // ------ REGISTRATION FIRST STEP ------
        this.registerStepOne = async (userData) => {
            const { email } = userData;
            const existingUser = await user_model_1.userModel.findOne({ email });
            if (existingUser)
                throw new Error("User already exists");
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT" });
            if (!studentRole)
                throw new Error("Default Student role not found");
            const user = await user_model_1.userModel.create({
                ...userData,
                roleId: studentRole._id,
                verificationStatus: false,
            });
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            await user_authcode_model_1.default.deleteMany({
                userId: user._id,
                purpose: "VERIFY_EMAIL",
            });
            await user_authcode_model_1.default.create({
                userId: user._id,
                code: otp,
                purpose: "VERIFY_EMAIL",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                isUsed: false,
            });
            try {
                await (0, sendEmail_1.sendEmail)({
                    to: email,
                    subject: "Verify your email",
                    html: (0, renderTemplate_1.renderTemplate)("otp-verification", {
                        firstName: user.firstName,
                        otp: otp,
                        expiryMinutes: 10,
                        year: new Date().getFullYear(),
                        appName: "Student Nexus",
                    }),
                    text: `Hello ${user.firstName}, Your OTP is ${otp}. It will expire in 10 minutes.`,
                });
            }
            catch (error) {
                console.error("Failed to send verification email:", error);
            }
            return user;
        };
        // ------ RESEND OTP ------
        this.resendOtp = async (email) => {
            const user = await user_model_1.userModel.findOne({ email });
            if (!user)
                throw new Error("User not found");
            if (user.verificationStatus)
                throw new Error("User already verified");
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            await user_authcode_model_1.default.deleteMany({
                userId: user._id,
                purpose: "VERIFY_EMAIL",
            });
            await user_authcode_model_1.default.create({
                userId: user._id,
                code: otp,
                purpose: "VERIFY_EMAIL",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                isUsed: false,
            });
            try {
                await (0, sendEmail_1.sendEmail)({
                    to: email,
                    subject: "Verify your email",
                    html: (0, renderTemplate_1.renderTemplate)("otp-verification", {
                        firstName: user.firstName,
                        otp: otp,
                        expiryMinutes: 10,
                        year: new Date().getFullYear(),
                        appName: "Student Nexus",
                    }),
                    text: `Hello ${user.firstName}, Your OTP is ${otp}. It will expire in 10 minutes.`,
                });
            }
            catch (error) {
                console.error("Failed to send verification email:", error);
            }
            return true;
        };
        // ------ EMAIL VERIFICATION ------
        this.verifyEmail = async (email, otp, ip, userAgent) => {
            const user = await user_model_1.userModel.findOne({ email });
            if (!user)
                throw new Error("User not found");
            const authCode = await user_authcode_model_1.default.findOne({
                userId: user._id,
                code: otp,
                purpose: "VERIFY_EMAIL",
                isUsed: false,
            });
            if (!authCode)
                throw new Error("Invalid or expired OTP");
            authCode.isUsed = true;
            await authCode.save();
            user.verificationStatus = true;
            await user.save();
            return user;
        };
        // ------ LOGIN USER ------
        this.loginUser = async (email, password, ip, userAgent) => {
            const user = await user_model_1.userModel.findOne({ email }).select("+password");
            if (!user)
                throw new Error("User not found");
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid)
                throw new Error("Invalid password");
            if (!user.verificationStatus)
                throw new Error("User not verified. Please verify your email.");
            if (user.status !== "ACTIVE")
                throw new Error("User account is not active. Please complete registration or contact administrator.");
            const accessToken = (0, jwt_1.signAccessToken)({ userId: user._id });
            const refreshToken = (0, jwt_1.signRefreshToken)({
                userId: user._id,
                ipAddress: ip,
                userAgent: userAgent,
            });
            await refreshToken_model_1.refreshTokenModel.create({
                user: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdByIp: ip,
            });
            const populatedUser = await this.getById(user._id.toString());
            return { user: populatedUser, accessToken, refreshToken };
        };
        this.refreshToken = async (token, ip) => {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const existingToken = await refreshToken_model_1.refreshTokenModel.findOne({ token });
            if (!existingToken)
                throw new Error("Token not found");
            if (!existingToken.isActive)
                throw new Error("Token expired or revoked");
            const user = await user_model_1.userModel.findById(decoded.userId);
            if (!user)
                throw new Error("User not found");
            const newRefreshToken = (0, jwt_1.signRefreshToken)({
                userId: user._id,
                ipAddress: ip,
            });
            existingToken.revokedAt = new Date();
            existingToken.revokedByIp = ip;
            existingToken.replacedByToken = newRefreshToken;
            await existingToken.save();
            await refreshToken_model_1.refreshTokenModel.create({
                user: user._id,
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + (0, jwt_1.parseExpiryToMs)(process.env.REFRESH_TOKEN_EXPIRES)),
                createdByIp: ip,
            });
            const accessToken = (0, jwt_1.signAccessToken)({ userId: user._id });
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        };
        this.logout = async (token, ip) => {
            const existingToken = await refreshToken_model_1.refreshTokenModel.findOne({ token });
            if (!existingToken)
                return;
            existingToken.revokedAt = new Date();
            existingToken.revokedByIp = ip;
            await existingToken.save();
        };
        this.completeRegistration = async (userId, registrationData, ip, userAgent) => {
            const user = await user_model_1.userModel.findById(userId);
            if (!user)
                throw new Error("User not found");
            if (!user.verificationStatus)
                throw new Error("User email not verified");
            const { universityId, roleId, courseIds, ...profileData } = registrationData;
            const role = await role_model_1.default.findById(roleId);
            if (!role)
                throw new Error("Role not found");
            user.universityId = universityId;
            user.roleId = roleId;
            user.courseIds = courseIds;
            user.status = "ACTIVE";
            await user.save();
            if (role.name === "STUDENT") {
                await student_profile_model_1.default.findOneAndUpdate({ userId: user._id }, {
                    semesterId: profileData.semesterId,
                    userId: user._id,
                    hobby_badge: profileData.hobby_badge,
                    skills: profileData.skills,
                }, { upsert: true, new: true });
            }
            else if (role.name === "ALUMINI") {
                await alumini_profile_1.default.findOneAndUpdate({ userId: user._id }, {
                    userId: user._id,
                    currentCompany: profileData.currentCompany,
                    jobTitle: profileData.jobTitle,
                    experienceYears: profileData.experienceYears,
                    skills: profileData.skills,
                }, { upsert: true, new: true });
            }
            else if (role.name === "TEACHER") {
                await teacher_profile_model_1.default.findOneAndUpdate({ userId: user._id }, {
                    userId: user._id,
                    designation: profileData.designation,
                    department: profileData.department,
                    experienceYears: profileData.experienceYears,
                }, { upsert: true, new: true });
            }
            const accessToken = (0, jwt_1.signAccessToken)({ userId: user._id });
            const refreshToken = (0, jwt_1.signRefreshToken)({
                userId: user._id,
                ipAddress: ip,
                userAgent: userAgent,
            });
            await refreshToken_model_1.refreshTokenModel.create({
                user: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdByIp: ip,
            });
            const populatedUser = await this.getById(user._id.toString());
            return { user: populatedUser, accessToken, refreshToken };
        };
        this.deleteUser = async (userId) => {
            const user = await user_model_1.userModel.findById(userId);
            if (!user)
                throw new Error("User not found");
            return await user_model_1.userModel.findByIdAndDelete(userId);
        };
        this.getMe = async (userId) => {
            const user = await user_model_1.userModel
                .findById(userId)
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
            if (!user)
                throw new Error("User not found");
            const roleName = user.roleId?.name;
            let profile = null;
            if (roleName === "STUDENT") {
                profile = await student_profile_model_1.default.findOne({ userId: user._id })
                    .populate("semesterId")
                    .lean();
            }
            else if (roleName === "ALUMINI") {
                profile = await alumini_profile_1.default.findOne({ userId: user._id }).lean();
            }
            else if (roleName === "TEACHER") {
                profile = await teacher_profile_model_1.default.findOne({ userId: user._id }).lean();
            }
            return { ...user, profile };
        };
        this.getAllUsers = async (authUserId) => {
            return await user_model_1.userModel
                .find()
                .select("-password")
                .populate("universityId")
                .populate('studentProfile')
                .populate("courseIds")
                .populate("roleId");
        };
        this.getUserByEmail = async (email) => {
            const user = await user_model_1.userModel.findOne({ email }).select("-password");
            if (!user)
                throw new Error("User not found");
            await user.populate([
                { path: "universityId" },
                { path: "courseIds" },
                { path: "roleId" },
                {
                    path: "studentProfile",
                    populate: { path: "semesterId" },
                },
                { path: "aluminiProfile" },
                { path: "teacherProfile" },
            ]);
            return user;
        };
        this.getById = async (id) => {
            const user = await user_model_1.userModel.findById(id);
            if (!user)
                throw new Error("User not found");
            await user.populate([
                { path: "universityId" },
                { path: "courseIds" },
                { path: "roleId" },
                {
                    path: "studentProfile",
                    populate: { path: "semesterId" },
                },
                { path: "aluminiProfile" },
                { path: "teacherProfile" },
            ]);
            return user;
        };
        // ------ FORGOT PASSWORD ------
        this.forgotPassword = async (email) => {
            const user = await user_model_1.userModel.findOne({ email });
            if (!user)
                throw new Error("User not found with this email");
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            // Clear old reset codes
            await user_authcode_model_1.default.deleteMany({
                userId: user._id,
                purpose: "RESET_PASSWORD",
            });
            await user_authcode_model_1.default.create({
                userId: user._id,
                code: otp,
                purpose: "RESET_PASSWORD",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
                isUsed: false,
            });
            try {
                await (0, sendEmail_1.sendEmail)({
                    to: email,
                    subject: "Password Reset OTP - Student Nexus",
                    html: (0, renderTemplate_1.renderTemplate)("otp-verification", {
                        firstName: user.firstName,
                        otp: otp,
                        expiryMinutes: 10,
                        year: new Date().getFullYear(),
                        appName: "Student Nexus (Reset Password)",
                    }),
                    text: `Hello ${user.firstName}, Your Password Reset OTP is ${otp}. It will expire in 10 minutes.`,
                });
            }
            catch (error) {
                console.error("Failed to send reset email:", error);
            }
            return true;
        };
        // ------ RESET PASSWORD ------
        this.resetPassword = async (email, otp, newPassword) => {
            const user = await user_model_1.userModel.findOne({ email });
            if (!user)
                throw new Error("User not found");
            const authCode = await user_authcode_model_1.default.findOne({
                userId: user._id,
                code: otp,
                purpose: "RESET_PASSWORD",
                isUsed: false,
            });
            if (!authCode)
                throw new Error("Invalid or expired reset code");
            // Check expiry manually just in case even though TTL index exists
            if (new Date() > authCode.expiresAt)
                throw new Error("Reset code has expired");
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
        this.verifyResetOtp = async (email, otp) => {
            const user = await user_model_1.userModel.findOne({ email });
            if (!user)
                throw new Error("User not found");
            const authCode = await user_authcode_model_1.default.findOne({
                userId: user._id,
                code: otp,
                purpose: "RESET_PASSWORD",
                isUsed: false,
            });
            if (!authCode)
                throw new Error("Invalid or expired reset code");
            return true;
        };
        // UPDATE PROFILE SERVICE
        this.updateProfile = async (userId, profileData) => {
            const user = await user_model_1.userModel.findById(userId);
            if (!user)
                throw new Error("User not found");
            // ❌ Prevent restricted updates
            if ("email" in profileData || "roleId" in profileData) {
                throw new Error("Email and Role cannot be updated");
            }
            const { firstName, lastName, avatar, coverImage, phone, bio, startYear, endYear, isPrivate, universityId, courseIds, skills, projects, semesterId, hobby_badge, ...otherProfileData } = profileData;
            // ===== USER UPDATE =====
            if (firstName !== undefined)
                user.firstName = firstName;
            if (lastName !== undefined)
                user.lastName = lastName;
            if (phone !== undefined)
                user.phone = phone;
            if (bio !== undefined)
                user.bio = bio;
            if (startYear !== undefined)
                user.startYear = startYear;
            if (endYear !== undefined)
                user.endYear = endYear;
            if (isPrivate !== undefined)
                user.isPrivate = isPrivate;
            if (universityId !== undefined)
                user.universityId = universityId;
            if (courseIds !== undefined) {
                user.courseIds = Array.isArray(courseIds) ? courseIds : [];
            }
            if (semesterId !== undefined)
                user.semesterId = semesterId;
            // ===== FILE HANDLING =====
            if (avatar !== undefined) {
                if (user.avatar && user.avatar !== avatar) {
                    (0, file_utils_1.deleteFileIfExists)(user.avatar);
                }
                user.avatar = avatar;
            }
            if (coverImage !== undefined) {
                if (user.coverImage && user.coverImage !== coverImage) {
                    (0, file_utils_1.deleteFileIfExists)(user.coverImage);
                }
                user.coverImage = coverImage;
            }
            await user.save();
            // ===== ROLE CHECK =====
            const role = await role_model_1.default.findById(user.roleId);
            if (!role)
                throw new Error("Role not found");
            let profileUpdateData = {
                userId: user._id,
                ...otherProfileData,
            };
            // ===== ROLE BASED PROFILE UPDATE =====
            if (role.name === "STUDENT") {
                if (skills !== undefined)
                    profileUpdateData.skills = skills;
                if (projects !== undefined)
                    profileUpdateData.projects = projects;
                if (semesterId !== undefined)
                    profileUpdateData.semesterId = semesterId;
                if (hobby_badge !== undefined)
                    profileUpdateData.hobby_badge = hobby_badge;
                await student_profile_model_1.default.findOneAndUpdate({ userId: user._id }, profileUpdateData, { upsert: true, new: true });
            }
            else if (role.name === "ALUMINI") {
                if (skills !== undefined)
                    profileUpdateData.skills = skills;
                if (projects !== undefined)
                    profileUpdateData.projects = projects;
                await alumini_profile_1.default.findOneAndUpdate({ userId: user._id }, profileUpdateData, { upsert: true, new: true });
            }
            else if (role.name === "TEACHER") {
                await teacher_profile_model_1.default.findOneAndUpdate({ userId: user._id }, profileUpdateData, { upsert: true, new: true });
            }
            return await this.getById(userId);
        };
        this.getMutualFollowers = async (currentUserId) => {
            const user = await user_model_1.userModel.findById(currentUserId);
            if (!user)
                throw new Error("User not found");
            console.log(currentUserId);
            const following = await follow_model_1.followModel.find({
                follower: currentUserId,
                status: "ACCEPTED"
            }).select("following");
            const followingIds = following.map((follow) => follow.following);
            console.log(followingIds);
            const muttualFollows = await follow_model_1.followModel.find({
                follower: { $in: followingIds },
                following: currentUserId,
                status: "ACCEPTED"
            }).populate({
                path: "follower",
                select: "firstName lastName avatar"
            });
            const muttualFollowsIds = muttualFollows.map((follow) => follow.follower);
            return muttualFollowsIds;
        };
    }
}
exports.AuthService = AuthService;
