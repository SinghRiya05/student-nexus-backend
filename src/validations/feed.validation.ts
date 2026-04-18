import { z } from "zod";

const toStringArray = (val: unknown): unknown => {
  if (Array.isArray(val)) {
    // If the array has one string element that looks like a JSON array, parse it.
    if (
      val.length === 1 &&
      typeof val[0] === "string" &&
      val[0].trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(val[0].trim());
        if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim());
      } catch {
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
      } catch {
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

const cleanString = (val: unknown) =>
  typeof val === "string" ? val.replace(/^["'\s]+|["'\s]+$/g, "").trim() : val;

export const createFeedSchema = z.object({
  body: z.object({
    content: z.preprocess(
      cleanString,
      z
        .string({
          message: "Content is required",
        })
        .min(1, "Content cannot be empty")
    ),
    media: z.preprocess(cleanString, z.string().optional()),
    hashtags: z.preprocess(toStringArray, z.array(z.string()).optional()),
    link: z.preprocess(
      cleanString,
      z.string().url("Invalid URL format").optional().or(z.literal(""))
    ),
  }),
});

export const updateFeedSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Feed ID is required",
    }),
  }),
  body: z.object({
    content: z.preprocess(
      cleanString,
      z.string().min(1, "Content cannot be empty").optional()
    ),
    media: z.preprocess(cleanString, z.string().optional()),
    hashtags: z.preprocess(toStringArray, z.array(z.string()).optional()),
    link: z.preprocess(
      cleanString,
      z.string().url("Invalid URL format").optional().or(z.literal(""))
    ),
  }),
});

export const commentSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Feed ID is required",
    }),
  }),
  body: z.object({
    content: z.preprocess(
      cleanString,
      z
        .string({
          message: "Comment content is required",
        })
        .min(1, "Comment cannot be empty")
    ),
  }),
});

export const feedIdSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Feed ID is required",
    }),
  }),
});
