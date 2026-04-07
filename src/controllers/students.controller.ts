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
}
