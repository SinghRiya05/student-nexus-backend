import mongoose, { Schema, Document, Types } from "mongoose";
import { IUniversityCourse } from "../interfaces/masterInterfaces/university-course.interface";
import { STATUS } from "../config";

export interface IUniversityCourseDocument extends IUniversityCourse, Document { }

const universityCourseSchema: Schema<IUniversityCourseDocument> = new Schema(
    {
        universityId: {
            type: Types.ObjectId,
            ref: "University",
            required: true,
        },
        courseId: {
            type: Types.ObjectId,
            ref: "Course",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.ACTIVE,
        },
    },
    {
        timestamps: true,
    }
);

universityCourseSchema.index(
    { universityId: 1, courseId: 1 },
    { unique: true }
);

const UniversityCourseModel = mongoose.model<IUniversityCourseDocument>(
    "UniversityCourse",
    universityCourseSchema
);

export default UniversityCourseModel;
