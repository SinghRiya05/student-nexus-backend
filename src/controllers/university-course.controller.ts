import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import { UniversityCourseService } from "../services/university-course.service";

const universityCourseService = new UniversityCourseService();

export class UniversityCourseController {

    assignCourse = async (req: Request, res: Response) => {
        const { universityId, courseId } = req.body;
        const result = await universityCourseService.assignCourse(universityId, courseId);
        sendResponse(res, STATUS_CODES.CREATED, true, "Course assigned successfully", result);
    }

    bulkAssignCourses = async (req: Request, res: Response) => {
        const { universityId, courseIds } = req.body;
        const result = await universityCourseService.bulkAssignCourses(universityId, courseIds);
        sendResponse(res, STATUS_CODES.CREATED, true, "Courses assigned successfully", result);
    }

    bulkRemoveCourses = async (req: Request, res: Response) => {
        const { universityId, courseIds } = req.body;
        const result = await universityCourseService.bulkRemoveCourses(universityId, courseIds);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Courses removed successfully", result);
    }

    removeCourse = async (req: Request, res: Response) => {
        const { universityId, courseId } = req.body;
        const result = await universityCourseService.removeCourse(universityId, courseId);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Course removed successfully", result);
    }

    getCoursesByUniversity = async (req: Request, res: Response) => {
        const universityId = req.params.universityId as string;
        const result = await universityCourseService.getCoursesByUniversity(universityId);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Courses fetched successfully", result);
    }

    getUniversitiesByCourse = async (req: Request, res: Response) => {
        const courseId = req.params.courseId as string;
        const result = await universityCourseService.getUniversitiesByCourse(courseId);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Universities fetched successfully", result);
    }


}