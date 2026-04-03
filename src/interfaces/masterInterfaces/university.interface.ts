import { Types } from "mongoose";
import { STATUS } from "../../config";


export interface IUniversity {
    name: string;
    short_name?: string;
    domain?: string;
    country: Types.ObjectId;
    state: Types.ObjectId;
    city: Types.ObjectId;
    isVerified: boolean;
    isDeleted: boolean;
    status: STATUS;
    isActive: boolean;
    description?: string;
    image?: string;
    logo?: string;
}
