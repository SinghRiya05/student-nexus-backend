import { z } from "zod";
import { Types } from "mongoose";
import { STATUS } from "../config";

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const createUniversitySchema = z.object({
  body: z.object({
    name: z.string(),
    short_name: z.string().optional(),
    image: z.string().optional(),
    logo: z.string().optional(),
    domain: z.string().optional(),
    description: z.string().optional(),
    country: z.string().refine(objectIdValidation, {
      message: "Invalid country ID",
    }),
    state: z.string().refine(objectIdValidation, {
      message: "Invalid state ID",
    }),
    city: z.string().refine(objectIdValidation, {
      message: "Invalid city ID",
    }),
    status: z.nativeEnum(STATUS).optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateUniversitySchema = z.object({
  params: z.object({
    id: z.string().refine(objectIdValidation, {
      message: "Invalid university ID",
    }),
  }),
  body: z.object({
    name: z.string().optional(),
    short_name: z.string().optional(),
    image: z.string().optional(),
    logo: z.string().optional(),
    domain: z.string().optional(),
    description: z.string().optional(),
    country: z.string().refine(objectIdValidation, {
      message: "Invalid country ID",
    }).optional(),
    state: z.string().refine(objectIdValidation, {
      message: "Invalid state ID",
    }).optional(),
    city: z.string().refine(objectIdValidation, {
      message: "Invalid city ID",
    }).optional(),
    status: z.nativeEnum(STATUS).optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const universityIdParamsSchema = z.object({
  params: z.object({
    id: z.string().refine(objectIdValidation, {
      message: "Invalid university ID",
    }),
  }),
});