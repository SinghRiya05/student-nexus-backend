import mongoose, { Schema, Document, Types } from "mongoose";
import { IUniversity } from "../interfaces/masterInterfaces/university.interface";
import { STATUS } from "../config";

export interface IUniversityDocument extends IUniversity, Document {}

const universitySchema: Schema<IUniversityDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    short_name: {
      type: String,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    domain: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    country: {
      type: Types.ObjectId,
      ref: "Country",
      required: true,
    },

    state: {
      type: Types.ObjectId,
      ref: "State",
      required: true,
    },

    city: {
      type: Types.ObjectId,
      ref: "City",
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    courses: {
      type: [Types.ObjectId],
      ref: "Course",
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

const UniversityModel = mongoose.model<IUniversityDocument>(
  "University",
  universitySchema
);

export default UniversityModel;