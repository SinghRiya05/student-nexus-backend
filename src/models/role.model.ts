import mongoose, { Schema, Document } from "mongoose";
import {IRole} from "../interfaces/masterInterfaces/role.interface"
import { STATUS } from "../config";

export interface IRoleDocument extends IRole, Document {}

const roleSchema: Schema<IRoleDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default:STATUS.ACTIVE
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

const RoleModel = mongoose.model<IRoleDocument>("Role", roleSchema);

export default RoleModel;