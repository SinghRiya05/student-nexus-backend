import { Schema, model, Types } from "mongoose";
import { ICourse } from "../interfaces/masterInterfaces/course.interface";
import { STATUS } from "../config";


const courseSchema = new Schema<ICourse>(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
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
      enum:Object.values(STATUS),
      default:STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const courseModel = model<ICourse>("Course", courseSchema);