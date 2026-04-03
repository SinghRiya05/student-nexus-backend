import { Types } from "mongoose";

export interface ITeacherClass {
    teacherId: Types.ObjectId;
    title: string;
    courseId: Types.ObjectId;
    semesterId?: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    meetingLink?: string;
}
