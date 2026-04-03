import { Types } from "mongoose";

export interface ITeacherProfile {
    userId: Types.ObjectId;
    designation?: string;
    department?: string;
    experienceYears?: number;
    bio?: string;
}
