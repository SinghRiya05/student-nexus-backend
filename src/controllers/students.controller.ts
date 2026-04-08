import { Request, Response } from "express";
import { StudentService } from "../services/students.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import StudentProfileModel from "../models/student.profile.model";

const studentService = new StudentService();

export class StudentController {
  
  // --- GET ALL STUDENTS ---
  getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const students = await studentService.getAllStudents();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Students fetched successfully.", students);
  });

  // --- GET STUDENTS FROM MY UNIVERSITY ---
  getStudentsByMyUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }
    const students = await studentService.getStudentsByUniversity(user.universityId.toString(), user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Students from your university fetched successfully.", students);
  });


  // --- GET STUDENTS BY MATCHED HOBBY BADGE ---
  getStudentsByMatchedHobbyBadge = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }

    const userProfile = await StudentProfileModel.findOne({ userId: user._id });
    
    if (!userProfile || !userProfile.hobby_badge) {
      return sendResponse(res, STATUS_CODES.SUCCESS, true, "Please set a hobby badge in your profile to find matches.", []);
    }

    const students = await studentService.getStudentsByMatchedHobbyBadge(
      userProfile.hobby_badge, 
      user.universityId.toString(), 
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Students with matching hobby badge fetched successfully.", students);
  });


}
