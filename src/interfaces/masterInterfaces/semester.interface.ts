import { STATUS } from "../../config";
import { Types } from "mongoose";

export interface ISemester {
  name: string;
  number: number;
  courseId: Types.ObjectId;
  description?: string;
  status?: STATUS;
}
