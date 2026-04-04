import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";


const courseService = new CourseService();

export class CourseController {

    createCourse = async (req: Request, res: Response) => {
        const result = await courseService.createCourse(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "Course created successfully", result);
    }

    getAllCourses = async (req: Request, res: Response) => {
        const result = await courseService.getAllCourses();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Courses fetched successfully", result);
    }

    getCourseById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await courseService.getCourseById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Course fetched successfully", result);
    }

    updateCourse = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await courseService.updateCourse(id, req.body);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Course updated successfully", result);
    }

    deleteCourse = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await courseService.deleteCourse(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Course deleted successfully", result);
    }
}