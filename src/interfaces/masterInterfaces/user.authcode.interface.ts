import { Types } from "mongoose";

export interface IUserAuthCode {
  userId: Types.ObjectId;
  code: string;
  purpose?: string;
  expiresAt: Date;
  isUsed?: boolean;
}
