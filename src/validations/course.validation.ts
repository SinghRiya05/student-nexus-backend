import { z } from "zod";
import { Types } from "mongoose";
import { STATUS } from "../config";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const createCourseSchema = z.object({
  body: z.object({
    courseName: z.string(),
    course_short_name: z.string(),
    durationYears: z.number().min(1, "Duration must be at least 1 year"),
    description: z.string().optional(),
    status: z.nativeEnum(STATUS).optional(),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().refine(objectIdValidation, {
      message: "Invalid course ID",
    }),
  }),
  body: z.object({
    courseName: z.string().optional(),
    course_short_name: z.string().optional(),
    durationYears: z.number().min(1, "Duration must be at least 1 year").optional(),
    description: z.string().optional(),
    status: z.nativeEnum(STATUS).optional(),
  }),
});

export const courseIdParamsSchema = z.object({
  params: z.object({
    id: z.string().refine(objectIdValidation, {
      message: "Invalid course ID",
    }),
  }),
});
