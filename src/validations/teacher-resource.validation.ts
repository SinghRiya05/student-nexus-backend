import { z } from "zod";

export const createTeacherResourceValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required").trim(),
    courseId: z.string().min(1, "Course ID is required"),
    semesterId: z.string().min(1, "Semester ID is required"),
    fileUrl: z.string().min(1, "File is required"),
    link: z.string().optional(),
    isPaid: z.preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean().optional().default(false)),
    price: z.preprocess((val) => {
      if (typeof val === "string") return parseFloat(val);
      return val;
    }, z.number().optional().default(0)),
  }),
});

export const updateTeacherResourceValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().min(1, "Description is required").trim().optional(),
    courseId: z.string().min(1, "Course ID is required").optional(),
    semesterId: z.string().min(1, "Semester ID is required").optional(),
    link: z.string().optional(),
    isPaid: z.preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean().optional()),
    price: z.preprocess((val) => {
      if (typeof val === "string") return parseFloat(val);
      return val;
    }, z.number().optional()),
  }),
  params: z.object({
    resourceId: z.string().min(1, "Resource ID is required"),
  }),
});
