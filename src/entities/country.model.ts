import mongoose, { Schema, Document } from "mongoose";
import { ICountry } from "../interfaces/masterInterfaces/country.interface";

export interface ICountryDocument extends ICountry, Document {}

const countrySchema: Schema<ICountryDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
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

const CountryModel = mongoose.model<ICountryDocument>(
  "Country",
  countrySchema
);

export default CountryModel;