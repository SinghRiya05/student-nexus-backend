import { Types } from "mongoose";

export interface IFeed {
  authorId: Types.ObjectId;
  content: string;
  media?: string;
  hashtags?: string[];
  link?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
