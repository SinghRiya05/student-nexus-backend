import { Schema, model } from "mongoose";
import { IRolePermission } from "../interfaces/masterInterfaces/role-permission.interface";

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

export const RolePermissionModel = model<IRolePermission>("RolePermission", rolePermissionSchema);