"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
const stringToNumber = (val) => {
    if (typeof val === "string")
        return parseFloat(val);
    return val;
};
const stringToBoolean = (val) => {
    if (val === "true" || val === true)
        return true;
    if (val === "false" || val === false)
        return false;
    return val;
};
// Strips surrounding quotes and whitespace from a single string
const cleanId = (val) => val.replace(/^["'\s]+|["'\s]+$/g, "").trim();
// Resolves to a clean string array of IDs — handles JSON strings, plain strings, or arrays
const toIdArray = (val) => {
    if (Array.isArray(val))
        return val.map((v) => (typeof v === "string" ? cleanId(v) : v));
    if (typeof val === "string") {
        const stripped = val.trim();
        try {
            const parsed = JSON.parse(stripped);
            if (Array.isArray(parsed))
                return parsed.map((v) => (typeof v === "string" ? cleanId(v) : v));
            if (typeof parsed === "string")
                return [cleanId(parsed)];
        }
        catch {
            return [cleanId(stripped)];
        }
    }
    return val;
};
// Resolves to a clean string array — handles JSON strings, plain strings, or arrays
const toStringArray = (val) => {
    if (Array.isArray(val))
        return val.map((v) => (typeof v === "string" ? v.trim() : v));
    if (typeof val === "string") {
        const stripped = val.trim();
        try {
            const parsed = JSON.parse(stripped);
            if (Array.isArray(parsed))
                return parsed.map((v) => (typeof v === "string" ? v.trim() : v));
            if (typeof parsed === "string")
                return [parsed.trim()];
        }
        catch {
            return [stripped];
        }
    }
    return val;
};
// Strips surrounding quotes from a single ObjectId string
const cleanString = (val) => typeof val === "string" ? val.replace(/^["'\s]+|["'\s]+$/g, "").trim() : val;
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        avatar: zod_1.z.string().optional(),
        coverImage: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        startYear: zod_1.z.preprocess(stringToNumber, zod_1.z.number().optional()),
        endYear: zod_1.z.preprocess(stringToNumber, zod_1.z.number().optional()),
        isPrivate: zod_1.z.preprocess(stringToBoolean, zod_1.z.boolean().optional()),
        universityId: zod_1.z.preprocess(cleanString, zod_1.z
            .string()
            .refine(objectIdValidation, { message: "Invalid university ID" })
            .optional()),
        courseIds: zod_1.z.preprocess(toIdArray, zod_1.z
            .array(zod_1.z
            .string()
            .refine(objectIdValidation, { message: "Invalid course ID" }))
            .optional()),
        semesterId: zod_1.z.preprocess(cleanString, zod_1.z
            .string()
            .refine(objectIdValidation, { message: "Invalid semester ID" })
            .optional()),
        hobby_badge: zod_1.z.string().optional(),
        skills: zod_1.z.preprocess(toStringArray, zod_1.z.array(zod_1.z.string()).optional()),
        projects: zod_1.z.preprocess(toStringArray, zod_1.z.array(zod_1.z.string()).optional()),
        currentCompany: zod_1.z.string().optional(),
        jobTitle: zod_1.z.string().optional(),
        experienceYears: zod_1.z.preprocess(stringToNumber, zod_1.z.number().optional()),
        designation: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
    }),
});
