"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const courseSchema = new mongoose_1.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    course_short_name: {
        type: String,
        required: true,
        trim: true,
    },
    durationYears: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(config_1.STATUS),
        default: config_1.STATUS.ACTIVE,
    },
}, {
    timestamps: true,
});
exports.CourseModel = (0, mongoose_1.model)("Course", courseSchema);
