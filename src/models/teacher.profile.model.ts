import mongoose, { Schema, Document } from "mongoose";
import { ITeacherProfile } from "../interfaces/masterInterfaces/teacher.profile.interface";

export interface ITeacherProfileDocument extends ITeacherProfile, Document {}

const teacherProfileSchema: Schema<ITeacherProfileDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    designation: {
      type: String,
      trim: true,
    },
    
    department: {
      type: String,
      trim: true,
    },
    
    experienceYears: {
      type: Number,
    },
    
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeacherProfileModel = mongoose.model<ITeacherProfileDocument>("TeacherProfile", teacherProfileSchema);

export default TeacherProfileModel;
