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

    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    country: {
      type: Types.ObjectId,
      ref: "Country",
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