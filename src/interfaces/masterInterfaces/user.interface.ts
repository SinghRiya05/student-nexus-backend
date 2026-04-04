import { Types } from "mongoose";

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
  courseId?: Types.ObjectId[];
  semesterId?: Types.ObjectId;
  roleId: Types.ObjectId;

  verificationStatus: boolean;
  status: STATUS;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(password: string): Promise<boolean>;
}