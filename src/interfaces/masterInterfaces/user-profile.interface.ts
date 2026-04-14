import { Types } from "mongoose";

export interface IUpdateProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  startYear?: number;
  endYear?: number;
  isPrivate?: boolean;

  universityId?: Types.ObjectId;
  courseIds?: Types.ObjectId[];
  
  // Specific to varying profiles
  semesterId?: Types.ObjectId;
  hobby_badge?: string;
  skills?: string[];
  projects?: string[];
  
  currentCompany?: string;
  jobTitle?: string;
  experienceYears?: number;
  
  designation?: string;
  department?: string;
}
