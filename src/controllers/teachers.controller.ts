import { Request, Response } from "express";
import { TeacherService } from "../services/teachers.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

export class TeacherController {

  // GET /teachers/same-university
  getSameUniversityTeachers = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user?.universityId) {
      throw new Error("User's university association not found.");
    }

    const teachers = await TeacherService.getSameUniversityTeachers(
      user.universityId.toString(),
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Same university teachers fetched successfully.", teachers);
  });

  // GET /teachers/class-teachers
  getClassTeachers = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user?.universityId) {
      throw new Error("User's university association not found.");
    }

    const teachers = await TeacherService.getClassTeachers(
      user.universityId.toString(),
      (user.courseIds || []).map((id: any) => id.toString()),
      user.semesterId?.toString(),
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Class teachers fetched successfully.", teachers);
  });

  // GET /teachers/other-universities
  getOtherUniversityTeachers = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    const teachers = await TeacherService.getOtherUniversityTeachers(
      user?.universityId?.toString(),
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Teachers from other universities fetched successfully.", teachers);
  });

  // GET /teachers/by-course/:courseId
  getTeachersByCourse = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const courseId = req.params.courseId as string;

    if (!courseId) {
      throw new Error("courseId parameter is required.");
    }

    const teachers = await TeacherService.getTeachersByCourse(
      courseId,
      user._id.toString()
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Teachers for the specified course fetched successfully.", teachers);
  });
}
