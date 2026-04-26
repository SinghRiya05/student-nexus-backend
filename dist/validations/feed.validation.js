"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedIdSchema = exports.commentSchema = exports.updateFeedSchema = exports.createFeedSchema = void 0;
const zod_1 = require("zod");
const toStringArray = (val) => {
    if (Array.isArray(val)) {
        // If the array has one string element that looks like a JSON array, parse it.
        if (val.length === 1 &&
            typeof val[0] === "string" &&
            val[0].trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(val[0].trim());
                if (Array.isArray(parsed))
                    return parsed.map((v) => String(v).trim());
            }
            catch {
                // Fallback to normal behavior
            }
        }
        return val.map((v) => (typeof v === "string" ? v.trim() : v));
    }
    if (typeof val === "string") {
        const stripped = val.trim();
        if (stripped.startsWith("[") && stripped.endsWith("]")) {
            try {
                const parsed = JSON.parse(stripped);
                return Array.isArray(parsed) ? parsed : [parsed];
            }
            catch {
                return [stripped];
            }
        }
        return stripped
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return val;
};
const cleanString = (val) => typeof val === "string" ? val.replace(/^["'\s]+|["'\s]+$/g, "").trim() : val;
exports.createFeedSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.preprocess(cleanString, zod_1.z
            .string({
            message: "Content is required",
        })
            .min(1, "Content cannot be empty")),
        media: zod_1.z.preprocess(cleanString, zod_1.z.string().optional()),
        hashtags: zod_1.z.preprocess(toStringArray, zod_1.z.array(zod_1.z.string()).optional()),
        link: zod_1.z.preprocess(cleanString, zod_1.z.string().url("Invalid URL format").optional().or(zod_1.z.literal(""))),
    }),
});
exports.updateFeedSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            message: "Feed ID is required",
        }),
    }),
    body: zod_1.z.object({
        content: zod_1.z.preprocess(cleanString, zod_1.z.string().min(1, "Content cannot be empty").optional()),
        media: zod_1.z.preprocess(cleanString, zod_1.z.string().optional()),
        hashtags: zod_1.z.preprocess(toStringArray, zod_1.z.array(zod_1.z.string()).optional()),
        link: zod_1.z.preprocess(cleanString, zod_1.z.string().url("Invalid URL format").optional().or(zod_1.z.literal(""))),
    }),
});
exports.commentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            message: "Feed ID is required",
        }),
    }),
    body: zod_1.z.object({
        content: zod_1.z.preprocess(cleanString, zod_1.z
            .string({
            message: "Comment content is required",
        })
            .min(1, "Comment cannot be empty")),
    }),
});
exports.feedIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            message: "Feed ID is required",
        }),
    }),
});
