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


  // --- TEACHER RESOURCE CRUD ---
  createResource = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = req.body || {};

    if (req.file) {
      data.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }

    data.teacherId = user._id;
    
    if (user.universityId) {
      data.universityId = user.universityId;
    }

    const resource = await TeacherService.createResource(data);
    sendResponse(res, STATUS_CODES.CREATED, true, "Resource uploaded successfully.", resource);
  });

  updateResource = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const resourceId = req.params.resourceId as string;
    const data = req.body || {};

    if (req.file) {
      data.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }

    const resource = await TeacherService.updateResource(resourceId, user._id.toString(), data);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Resource updated successfully.", resource);
  });

  deleteResource = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const resourceId = req.params.resourceId as string;

    const resource = await TeacherService.deleteResource(resourceId, user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Resource deleted successfully.", resource);
  });

  getResourceById = catchAsync(async (req: Request, res: Response) => {
    const resourceId = req.params.resourceId as string;
    
    if (!resourceId) {
      throw new Error("resourceId parameter is required.");
    }

    const resource = await TeacherService.getResourceById(resourceId);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Resource fetched successfully.", resource);
  });

  getTeacherResources = catchAsync(async (req: Request, res: Response) => {
    const { teacherId } = req.params;
    // If no teacherId param, default to the logged-in user
    const targetTeacherId = teacherId || (req as any).user._id.toString();

    const resources = await TeacherService.getTeacherResources(targetTeacherId);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Resources fetched successfully.", resources);
  });

  getResourcesForStudents = catchAsync(async (req: Request, res: Response) => {
    const { universityId, courseId, semesterId } = req.query;

    const resources = await TeacherService.getResourcesForStudents(
      universityId as string,
      courseId as string,
      semesterId as string
    );
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Student resources fetched successfully.", resources);
  });
}
