import { Request, Response } from "express";
import { StudentService } from "../services/students.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

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


  // --- GET ALUMINI FROM MY UNIVERSITY ---
  getAluminiByMyUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }
    const students = await studentService.getAluminiByUniversity(user.universityId.toString(), user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumini from your university fetched successfully.", students);
  });
}
