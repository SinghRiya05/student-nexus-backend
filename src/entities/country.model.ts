import { model, Schema } from "mongoose";
import { STATUS } from "../config";
import { ICountry } from "../interfaces/masterInterfaces/country.interface";

const countryModelSchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: false
    },
    code: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true },
);


export const countryModel = model<ICountry>("Country", countryModelSchema);
