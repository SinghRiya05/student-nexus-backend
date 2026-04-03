import mongoose, { Schema, Document } from "mongoose";
import { ICity } from "../interfaces/masterInterfaces/city.interface";

export interface ICityDocument extends ICity, Document {}

const citySchema: Schema<ICityDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CityModel = mongoose.model<ICityDocument>(
  "City",
  citySchema
);

export default CityModel;
