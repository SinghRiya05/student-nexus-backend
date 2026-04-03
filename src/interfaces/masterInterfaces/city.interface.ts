import { Types } from "mongoose";

export interface ICity {
    name: string;
    stateId: Types.ObjectId;
    isActive: boolean;
    isDeleted: boolean;
}
