"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdParamsSchema = exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseName: zod_1.z.string(),
        course_short_name: zod_1.z.string(),
        durationYears: zod_1.z.number().min(1, "Duration must be at least 1 year"),
        description: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
    }),
});
exports.updateCourseSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }),
    }),
    body: zod_1.z.object({
        courseName: zod_1.z.string().optional(),
        course_short_name: zod_1.z.string().optional(),
        durationYears: zod_1.z.number().min(1, "Duration must be at least 1 year").optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
    }),
});
exports.courseIdParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }),
    }),
});
