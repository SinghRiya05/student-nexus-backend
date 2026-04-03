import { Types } from "mongoose";

export interface IStudentProfile {
    userId: Types.ObjectId;
    enrollmentNumber?: string;
    bio?: string;
    skills?: string[];
}
