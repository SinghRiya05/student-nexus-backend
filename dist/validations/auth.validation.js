"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRegistrationSchema = exports.resendOtpSchema = exports.verifyEmailSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({ message: "First name is required" }).trim().min(1, "First name is required"),
        lastName: zod_1.z.string().trim().optional(),
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email format"),
        phone: zod_1.z.string({ message: "Phone number is required" }).min(10, "Phone number must be at least 10 digits"),
        password: zod_1.z.string({ message: "Password is required" }).min(8, "Password must be at least 8 characters long"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email format"),
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email format"),
        otp: zod_1.z.string().min(1, "OTP is required").length(6, "OTP must be exactly 6 digits"),
    }),
});
exports.resendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email format"),
    }),
});
exports.completeRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid user ID",
        }),
        universityId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university ID",
        }),
        roleId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid role ID",
        }),
        courseIds: zod_1.z.array(zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        })).optional(),
        semesterId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid semester ID",
        }).optional(),
        hobby_badge: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        currentCompany: zod_1.z.string().optional(),
        jobTitle: zod_1.z.string().optional(),
        experienceYears: zod_1.z.number().optional(),
        designation: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
    }),
});
