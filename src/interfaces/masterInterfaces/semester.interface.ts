import { Types } from "mongoose";

export interface ISemester {
  courseId: Types.ObjectId;
  startYear: number;
  endYear: number;
  semester: number;
}