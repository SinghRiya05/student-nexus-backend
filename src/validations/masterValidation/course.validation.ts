import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createCourseSchema = z.object({
  body: z.object({
    courseName: z
      .string()
      .min(2, "Course name must be at least 2 characters")
      .max(100, "Course name too long")
      .trim(),

    university: objectIdSchema,

    durationYears: z
      .number("Duration is required")
      .min(1, "Duration must be at least 1 year")
      .max(10, "Duration seems invalid"),

    status: z
      .enum(["active", "inactive"])
      .optional()
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z.object({
    courseName: z
      .string()
      .min(2)
      .max(100)
      .trim()
      .optional(),

    university: objectIdSchema.optional(),

    durationYears: z
      .number()
      .min(1)
      .max(10)
      .optional(),

    status: z
      .enum(["active", "inactive"])
      .optional()
  }),
});

export const getCourseByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const deleteCourseSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});