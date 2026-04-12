import mongoose, { Schema, Document } from "mongoose";
import { ITeacherResource } from "../interfaces/masterInterfaces/teacher.resources.interface";

export interface ITeacherResourceDocument extends ITeacherResource, Document {}

const teacherResourceSchema: Schema<ITeacherResourceDocument> = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      trim: true,
      required: true,
    },
    
    fileUrl: {
      type: String,
      trim: true,
      required: true,
    },
    
    link: {
      type: String,
      trim: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },
    
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    universityId: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeacherResourceModel = mongoose.model<ITeacherResourceDocument>("TeacherResource", teacherResourceSchema);

export default TeacherResourceModel;
