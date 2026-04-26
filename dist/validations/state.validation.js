"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStateSchema = exports.createStateSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createStateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("State name should be a string"),
        countryId: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid country ID",
        }),
    }),
});
exports.updateStateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("State name should be a string").optional(),
        countryId: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid country ID",
        })
            .optional(),
    }),
});
