import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createSemesterSchema = z.object({
  body: z.object({

    courseId: objectIdSchema,

    startYear: z
      .number()
      .min(2000, "Invalid start year"),

    endYear: z
      .number()
      .min(2000, "Invalid end year"),

    semester: z
      .number()
      .min(1, "Semester must be at least 1")
      .max(12, "Semester seems invalid")
  })
});

export const updateSemesterSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),

  body: z.object({

    courseId: objectIdSchema.optional(),

    startYear: z
      .number()
      .optional(),

    endYear: z
      .number()
      .optional(),

    semester: z
      .number()
      .min(1)
      .max(12)
      .optional()
  })
});

export const getSemesterByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const deleteSemesterSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});