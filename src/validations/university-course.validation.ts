import { z } from "zod";
import { Types } from "mongoose";
import { STATUS } from "../config";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const assignCourseSchema = z.object({
  body: z.object({
    universityId: z.string().refine(objectIdValidation, {
      message: "Invalid university ID",
    }),
    courseId: z.string().refine(objectIdValidation, {
      message: "Invalid course ID",
    }),
    status: z.nativeEnum(STATUS).optional(),
  }),
});


export const universityCourseIdParamsSchema = z.object({
  params: z.object({
    id: z.string().refine(objectIdValidation, {
      message: "Invalid university-course ID",
    }),
  }),
});
