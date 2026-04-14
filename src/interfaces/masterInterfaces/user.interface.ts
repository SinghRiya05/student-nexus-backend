import { Types } from "mongoose";
import { IStudentProfile } from "./student.profile.interface";

export type STATUS = "ACTIVE" | "INACTIVE";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;

  universityId: Types.ObjectId;
  courseIds?: Types.ObjectId[];
  semesterId?: Types.ObjectId;
  roleId: Types.ObjectId;

  verificationStatus: boolean;
  status: STATUS;
  isPrivate: boolean;

  followersCount: number;
  followingCount: number;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  trustScore?: number;
  startYear?: number;
  endYear?: number;

  studentProfile?: IStudentProfile | null;
  aluminiProfile?: any;
  teacherProfile?: any;

  comparePassword(password: string): Promise<boolean>;

}
