import { Types } from "mongoose";

export interface IAluminiProfile {
    userId: Types.ObjectId;
    currentCompany?: string;
    jobTitle?: string;
    skills?: string[];
    projects?: string[];
}
