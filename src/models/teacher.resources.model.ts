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
    },
    
    fileUrl: {
      type: String,
      trim: true,
    },
    
    link: {
      type: String,
      trim: true,
    },
    
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

const TeacherResourceModel = mongoose.model<ITeacherResourceDocument>("TeacherResource", teacherResourceSchema);

export default TeacherResourceModel;
