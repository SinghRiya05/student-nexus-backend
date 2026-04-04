import { Schema, model, Types } from "mongoose";
import { IRefreshToken } from "../interfaces/masterInterfaces/refreshToken.interface";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    createdByIp: {
      type: String,
      required: true,
    },

    revokedAt: {
      type: Date,
    },

    revokedByIp: {
      type: String,
    },

    replacedByToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

refreshTokenSchema.virtual("isExpired").get(function (this: IRefreshToken) {
  return Date.now() >= this.expiresAt.getTime();
});

refreshTokenSchema.virtual("isActive").get(function (this: IRefreshToken) {
  return !this.revokedAt && !this.isExpired;
});

export const refreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
