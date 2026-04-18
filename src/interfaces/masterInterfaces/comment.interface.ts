import { Types } from "mongoose";

export interface IComment {
  feedId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
