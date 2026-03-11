import { Types } from "mongoose";
import { STATUS } from "../../config";

export interface ICourse {
  courseName: string;
  university: Types.ObjectId;
  durationYears: number;
  status?:STATUS;
}