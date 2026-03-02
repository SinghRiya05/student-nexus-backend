import { Types } from "mongoose";
import { STATUS } from "../../config";


export interface IUniversity {
    name: string;
    domain: string;
    country: Types.ObjectId;
    isVerified: boolean;
    isDeleted: boolean;
    status: STATUS;
    isActive: boolean;
}
