import { Types } from "mongoose";

export interface IRolePermission {
    role: Types.ObjectId; 
    permissions: Types.ObjectId[];
}