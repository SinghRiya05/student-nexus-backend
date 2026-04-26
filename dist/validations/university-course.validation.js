"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUniversityCoursesSchema = exports.universityCourseIdParamsSchema = exports.assignCourseSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const objectIdValidation = (val) => mongoose_1.Types.ObjectId.isValid(val);
exports.assignCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        universityId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university ID",
        }),
        courseId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        }),
        status: zod_1.z.nativeEnum(config_1.STATUS).optional(),
    }),
});
exports.universityCourseIdParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university-course ID",
        }),
    }),
});
exports.syncUniversityCoursesSchema = zod_1.z.object({
    body: zod_1.z.object({
        universityId: zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid university ID",
        }),
        courseIds: zod_1.z.array(zod_1.z.string().refine(objectIdValidation, {
            message: "Invalid course ID",
        })),
    }),
});
