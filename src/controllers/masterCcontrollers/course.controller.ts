import { Request, Response } from "express";
import { CourseService } from "../../services/masterServices/course.service";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";

export class CourseController {

  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  createCourse = async (req: Request, res: Response) => {
    const course = await this.courseService.createCourse(req.body);

    sendResponse(
      res,
      STATUS_CODES.CREATED,
      true,
      "Course created successfully",
      course
    );
  };

  getCourses = async (req: Request, res: Response) => {
    const courses = await this.courseService.getCourses();

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Courses fetched successfully",
      courses
    );
  };

  getCourseById = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const course = await this.courseService.getCourseById(id);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Course fetched successfully",
      course
    );
  };

  updateCourse = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const course = await this.courseService.updateCourse(id, req.body);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Course updated successfully",
      course
    );
  };

  deleteCourse = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const course = await this.courseService.deleteCourse(id);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Course deleted successfully",
      course
    );
  };
}