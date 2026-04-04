import { Types } from "mongoose";
import { STATUS } from "../../config";

export interface IUniversityCourse {
    universityId: Types.ObjectId;
    courseId: Types.ObjectId;
    status?: STATUS;
}