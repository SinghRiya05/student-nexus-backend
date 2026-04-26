"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterIdParamsSchema = exports.updateSemesterSchema = exports.createSemesterSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
exports.createSemesterSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        number: zod_1.z.number(),
        courseId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }),
        description: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
    }),
});
exports.updateSemesterSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid semester ID",
        }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        number: zod_1.z.number().optional(),
        courseId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
    }),
});
exports.semesterIdParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid semester ID",
        }),
    }),
});
