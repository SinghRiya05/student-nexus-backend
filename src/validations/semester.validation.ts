import { z } from "zod";
import { Types } from "mongoose";
import { STATUS } from "../config";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const createSemesterSchema = z.object({
    body: z.object({
        name: z.string(),
        number: z.number(),
        courseId: z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }),
        description: z.string().optional(),
        status: z.nativeEnum(STATUS).optional(),
    }),
});

export const updateSemesterSchema = z.object({
    params: z.object({
        id: z.string().refine(objectIdValidation, {
            message: "Invalid semester ID",
        }),
    }),
    body: z.object({
        name: z.string().optional(),
        number: z.number().optional(),
        courseId: z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }).optional(),
        description: z.string().optional(),
        status: z.nativeEnum(STATUS).optional(),
    }),
});

export const semesterIdParamsSchema = z.object({
    params: z.object({
        id: z.string().refine(objectIdValidation, {
            message: "Invalid semester ID",
        }),
    }),
});