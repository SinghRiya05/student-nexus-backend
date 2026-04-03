import { z } from "zod";
import { Types } from "mongoose";

export const createCitySchema = z.object({
    body: z.object({
        name: z.string("City name should be a string"),
        stateId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid state ID",
            }),
    }),
});

export const updateCitySchema = z.object({
    body: z.object({
        name: z.string("City name should be a string").optional(),
        stateId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid state ID",
            })
            .optional(),
    }),
});