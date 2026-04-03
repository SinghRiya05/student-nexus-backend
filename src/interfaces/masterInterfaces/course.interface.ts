import { Types } from "mongoose";
import { STATUS } from "../../config";

export interface ICourse {
  courseName: string;
  course_short_name: string;
  durationYears: number;
  description?: string;
  status?:STATUS;
}