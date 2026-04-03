import mongoose, { Schema, Document } from "mongoose";
import { IState } from "../interfaces/masterInterfaces/state.interface";

export interface IStateDocument extends IState, Document {}

const stateSchema: Schema<IStateDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
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

const StateModel = mongoose.model<IStateDocument>(
  "State",
  stateSchema
);

export default StateModel;
