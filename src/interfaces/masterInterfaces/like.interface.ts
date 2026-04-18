import { Types } from "mongoose";

export interface ILike {
  feedId: Types.ObjectId;
  authorId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
