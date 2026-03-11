import { Schema, model } from "mongoose";
import { IPermission } from "../interfaces/masterInterfaces/permission.interface";

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const permissionModel = model<IPermission>("Permission", permissionSchema);
