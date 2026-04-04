import { Types } from "mongoose";

export interface IRefreshToken {
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdByIp: string;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isExpired?: boolean;
  isActive?: boolean;
}
