import { Types } from "mongoose";

export interface IAluminiProfile {
    userId: Types.ObjectId;
    graduationYear?: number;
    currentCompany?: string;
    jobTitle?: string;
    bio?: string;
}
