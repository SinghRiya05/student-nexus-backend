import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

const stringToNumber = (val: unknown) => {
  if (typeof val === "string") return parseFloat(val);
  return val;
};

const stringToBoolean = (val: unknown) => {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val;
};

// Strips surrounding quotes and whitespace from a single string
const cleanId = (val: string) => val.replace(/^["'\s]+|["'\s]+$/g, "").trim();

// Resolves to a clean string array of IDs — handles JSON strings, plain strings, or arrays
const toIdArray = (val: unknown): unknown => {
  if (Array.isArray(val))
    return val.map((v) => (typeof v === "string" ? cleanId(v) : v));
  if (typeof val === "string") {
    const stripped = val.trim();
    try {
      const parsed = JSON.parse(stripped);
      if (Array.isArray(parsed))
        return parsed.map((v) => (typeof v === "string" ? cleanId(v) : v));
      if (typeof parsed === "string") return [cleanId(parsed)];
    } catch {
      return [cleanId(stripped)];
    }
  }
  return val;
};

// Resolves to a clean string array — handles JSON strings, plain strings, or arrays
const toStringArray = (val: unknown): unknown => {
  if (Array.isArray(val))
    return val.map((v) => (typeof v === "string" ? v.trim() : v));
  if (typeof val === "string") {
    const stripped = val.trim();
    try {
      const parsed = JSON.parse(stripped);
      if (Array.isArray(parsed))
        return parsed.map((v) => (typeof v === "string" ? v.trim() : v));
      if (typeof parsed === "string") return [parsed.trim()];
    } catch {
      return [stripped];
    }
  }
  return val;
};

// Strips surrounding quotes from a single ObjectId string
const cleanString = (val: unknown) =>
  typeof val === "string" ? val.replace(/^["'\s]+|["'\s]+$/g, "").trim() : val;

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    coverImage: z.string().optional(),
    bio: z.string().optional(),
    startYear: z.preprocess(stringToNumber, z.number().optional()),
    endYear: z.preprocess(stringToNumber, z.number().optional()),
    isPrivate: z.preprocess(stringToBoolean, z.boolean().optional()),

    universityId: z.preprocess(
      cleanString,
      z
        .string()
        .refine(objectIdValidation, { message: "Invalid university ID" })
        .optional(),
    ),
    courseIds: z.preprocess(
      toIdArray,
      z
        .array(
          z
            .string()
            .refine(objectIdValidation, { message: "Invalid course ID" }),
        )
        .optional(),
    ),
    semesterId: z.preprocess(
      cleanString,
      z
        .string()
        .refine(objectIdValidation, { message: "Invalid semester ID" })
        .optional(),
    ),

    hobby_badge: z.string().optional(),
    skills: z.preprocess(toStringArray, z.array(z.string()).optional()),
    projects: z.preprocess(toStringArray, z.array(z.string()).optional()),

    currentCompany: z.string().optional(),
    jobTitle: z.string().optional(),
    experienceYears: z.preprocess(stringToNumber, z.number().optional()),

    designation: z.string().optional(),
    department: z.string().optional(),
  }),
});
