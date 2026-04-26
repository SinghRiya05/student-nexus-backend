"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universityIdParamsSchema = exports.updateUniversitySchema = exports.createUniversitySchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
exports.createUniversitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        short_name: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        domain: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        country: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid country ID",
        }),
        state: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid state ID",
        }),
        city: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid city ID",
        }),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
        isVerified: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateUniversitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university ID",
        }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        short_name: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        domain: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        country: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid country ID",
        }).optional(),
        state: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid state ID",
        }).optional(),
        city: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid city ID",
        }).optional(),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
        isVerified: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.universityIdParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university ID",
        }),
    }),
});
