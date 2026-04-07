import { Types } from "mongoose";

export interface IAluminiProfile {
    userId: Types.ObjectId;
    currentCompany?: string;
    jobTitle?: string;
    experienceYears?: number;
    skills?: string[];
    projects?: string[];
}
