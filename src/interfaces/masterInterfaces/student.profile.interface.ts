import { Types } from "mongoose";

export interface IStudentProfile {
    userId: Types.ObjectId;
    hobby_badge?: string;
    skills?: string[];
    projects?: string[];
    trustScore?: number;
    startYear?: number;
    endYear?: number;
}
