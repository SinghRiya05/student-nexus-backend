"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherResourceValidation = exports.createTeacherResourceValidation = void 0;
const zod_1 = require("zod");
exports.createTeacherResourceValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").trim(),
        description: zod_1.z.string().min(1, "Description is required").trim(),
        courseId: zod_1.z.string().min(1, "Course ID is required"),
        semesterId: zod_1.z.string().min(1, "Semester ID is required"),
        fileUrl: zod_1.z.string().min(1, "File is required"),
        link: zod_1.z.string().optional(),
        isPaid: zod_1.z.preprocess((val) => {
            if (val === "true" || val === true)
                return true;
            if (val === "false" || val === false)
                return false;
            return val;
        }, zod_1.z.boolean().optional().default(false)),
        price: zod_1.z.preprocess((val) => {
            if (typeof val === "string")
                return parseFloat(val);
            return val;
        }, zod_1.z.number().optional().default(0)),
    }),
});
exports.updateTeacherResourceValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").trim().optional(),
        description: zod_1.z.string().min(1, "Description is required").trim().optional(),
        courseId: zod_1.z.string().min(1, "Course ID is required").optional(),
        semesterId: zod_1.z.string().min(1, "Semester ID is required").optional(),
        link: zod_1.z.string().optional(),
        isPaid: zod_1.z.preprocess((val) => {
            if (val === "true" || val === true)
                return true;
            if (val === "false" || val === false)
                return false;
            return val;
        }, zod_1.z.boolean().optional()),
        price: zod_1.z.preprocess((val) => {
            if (typeof val === "string")
                return parseFloat(val);
            return val;
        }, zod_1.z.number().optional()),
    }),
    params: zod_1.z.object({
        resourceId: zod_1.z.string().min(1, "Resource ID is required"),
    }),
});
