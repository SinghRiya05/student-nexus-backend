import mongoose, { Schema, Document } from "mongoose";
import { ISemester } from "../interfaces/masterInterfaces/semester.interface";
import { STATUS } from "../config";

export interface ISemesterDocument extends ISemester, Document {}

const semesterSchema: Schema<ISemesterDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
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

const SemesterModel = mongoose.model<ISemesterDocument>("Semester", semesterSchema);

export default SemesterModel;
