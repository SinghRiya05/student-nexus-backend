"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCitySchema = exports.createCitySchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createCitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("City name should be a string"),
        stateId: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid state ID",
        }),
    }),
});
exports.updateCitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("City name should be a string").optional(),
        stateId: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid state ID",
        })
            .optional(),
    }),
});
