import mongoose, { Schema, Document } from "mongoose";
import { IStudentProfile } from "../interfaces/masterInterfaces/student.profile.interface";

export interface IStudentProfileDocument extends IStudentProfile, Document {}

const studentProfileSchema: Schema<IStudentProfileDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },

    hobby_badge: {
      type: String,
      trim: true,
    },

    projects: [{
      type: String,
      trim: true,
    }],

    skills: [{
      type: String,
      trim: true,
    }]
  },
  {
    timestamps: true,
  }
);


const StudentProfileModel = mongoose.model<IStudentProfileDocument>("StudentProfile", studentProfileSchema);

export default StudentProfileModel;
