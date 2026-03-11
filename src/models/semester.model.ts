import { Schema, model, Types } from "mongoose";
import { ISemester } from "../interfaces/masterInterfaces/semester.interface";

const semesterSchema = new Schema<ISemester>(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true
    },

    startYear: {
      type: Number,
      required: true
    },

    endYear: {
      type: Number,
      required: true
    },

    semester: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

export const semesterModel = model<ISemester>("Semester", semesterSchema);