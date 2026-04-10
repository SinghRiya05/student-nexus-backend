import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string({ message: "First name is required" }).trim().min(1, "First name is required"),
    lastName: z.string().trim().optional(),
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    phone: z.string({ message: "Phone number is required" }).min(10, "Phone number must be at least 10 digits"),
    password: z.string({ message: "Password is required" }).min(8, "Password must be at least 8 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    otp: z.string().min(1, "OTP is required").length(6, "OTP must be exactly 6 digits"),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
  }),
});

export const completeRegistrationSchema = z.object({
  body: z.object({
    userId: z.string().refine(objectIdValidation, {
      message: "Invalid user ID",
    }),
    universityId: z.string().refine(objectIdValidation, {
      message: "Invalid university ID",
    }),
    roleId: z.string().refine(objectIdValidation, {
      message: "Invalid role ID",
    }),
    courseIds: z.array(z.string().refine(objectIdValidation, {
      message: "Invalid course ID",
    })).optional(),
    semesterId: z.string().refine(objectIdValidation, {
      message: "Invalid semester ID",
    }).optional(),
    hobby_badge: z.string().optional(),
    skills: z.array(z.string()).optional(),
    currentCompany: z.string().optional(),
    jobTitle: z.string().optional(),
    experienceYears: z.number().optional(),
    designation: z.string().optional(),
    department: z.string().optional(),
  }),
});
