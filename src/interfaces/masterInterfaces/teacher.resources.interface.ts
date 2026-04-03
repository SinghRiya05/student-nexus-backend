import { Types } from "mongoose";

export interface ITeacherResource {
    teacherId: Types.ObjectId;
    title: string;
    description?: string;
    fileUrl?: string;
    link?: string;
    courseId?: Types.ObjectId;
}
