import { model, Schema } from "mongoose";
import { IUniversity } from "../interfaces/masterInterfaces/university.interface";
import { STATUS } from "../config";

const universityModelSchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    domain: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    country: { 
        type: Schema.Types.ObjectId, 
        ref: "Country", 
        required: true 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true },
);

export const universityModel = model<IUniversity>("University", universityModelSchema);
