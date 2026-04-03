import { z } from "zod";
import { Types } from "mongoose";

export const createStateSchema = z.object({
    body: z.object({
        name: z.string("State name should be a string"),
        countryId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid country ID",
            }),
    }),
});

export const updateStateSchema = z.object({
    body: z.object({
        name: z.string("State name should be a string").optional(),
        countryId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid country ID",
            })
            .optional(),
    }),
});