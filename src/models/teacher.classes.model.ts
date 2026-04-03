import mongoose, { Schema, Document } from "mongoose";
import { ITeacherClass } from "../interfaces/masterInterfaces/teacher.classes.interface";

export interface ITeacherClassDocument extends ITeacherClass, Document {}

const teacherClassSchema: Schema<ITeacherClassDocument> = new Schema(
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
    
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },
    
    startTime: {
      type: Date,
      required: true,
    },
    
    endTime: {
      type: Date,
      required: true,
    },
    
    meetingLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeacherClassModel = mongoose.model<ITeacherClassDocument>("TeacherClass", teacherClassSchema);

export default TeacherClassModel;
