import { Request, Response } from "express";
import { StudentService } from "../services/students.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import StudentProfileModel from "../models/student.profile.model";

const studentService = new StudentService();

export class StudentController {

  // --- GET CURRENT STUDENT DATA (my own profile) ---
  getCurrentStudentData = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await studentService.getCurrentStudentData(user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Current student data fetched successfully.", data);
  });

  // --- GET ALL STUDENTS ---
  getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const students = await studentService.getAllStudents(user?._id?.toString());
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



  getStudentById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const student = await studentService.getStudentById(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Student fetched successfully.", student);
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



  // --- GET STUDENTS BY MATCHED SEMESTER WITH COURSE AND SAME UNIVERSITY ---
  getStudentsByMatchedSemesterWithCourseAndSameUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.universityId) {
      return sendResponse(res, STATUS_CODES.SUCCESS, true, "University association not found.", []);
    }

    const students = await studentService.getStudentsByMatchedSemesterWithCourseAndSameUniversity(
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Students with matching semester, course, and same university fetched successfully.", students);
  });

  getStudentsByMatchCourseAndSameUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user || !user.universityId) {
      return sendResponse(res, STATUS_CODES.SUCCESS, true, "University association not found.", []);
    }

    const students = await studentService.getStudentsByMatchCourseAndSameUniversity(
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Students with matching course and same university fetched successfully.", students);
  });

}
