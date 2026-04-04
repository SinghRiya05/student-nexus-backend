import mongoose, { Schema, Document } from "mongoose";
import { IUserAuthCode } from "../interfaces/masterInterfaces/user.authcode.interface";

export interface IUserAuthCodeDocument extends IUserAuthCode, Document {}

const userAuthCodeSchema: Schema<IUserAuthCodeDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      trim: true,
      default: "VERIFY_EMAIL",
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // Automatically deletes the document when the current time >= expiresAt
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserAuthCodeModel = mongoose.model<IUserAuthCodeDocument>("UserAuthCode", userAuthCodeSchema);

export default UserAuthCodeModel;
