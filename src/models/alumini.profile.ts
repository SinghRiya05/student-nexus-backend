import mongoose, { Schema, Document } from "mongoose";
import { IAluminiProfile } from "../interfaces/masterInterfaces/alumini.profile.interface";

export interface IAluminiProfileDocument extends IAluminiProfile, Document {}

const aluminiProfileSchema: Schema<IAluminiProfileDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    graduationYear: {
      type: Number,
    },
    
    currentCompany: {
      type: String,
      trim: true,
    },
    
    jobTitle: {
      type: String,
      trim: true,
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

const AluminiProfileModel = mongoose.model<IAluminiProfileDocument>("AluminiProfile", aluminiProfileSchema);

export default AluminiProfileModel;
