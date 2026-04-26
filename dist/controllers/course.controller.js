"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const course_service_1 = require("../services/course.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const courseService = new course_service_1.CourseService();
class CourseController {
    constructor() {
        this.createCourse = async (req, res) => {
            const result = await courseService.createCourse(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Course created successfully", result);
        };
        this.getAllCourses = async (req, res) => {
            const result = await courseService.getAllCourses();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Courses fetched successfully", result);
        };
        this.getCourseById = async (req, res) => {
            const id = req.params.id;
            const result = await courseService.getCourseById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Course fetched successfully", result);
        };
        this.updateCourse = async (req, res) => {
            const id = req.params.id;
            const result = await courseService.updateCourse(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Course updated successfully", result);
        };
        this.deleteCourse = async (req, res) => {
            const id = req.params.id;
            const result = await courseService.deleteCourse(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Course deleted successfully", result);
        };
    }
}
exports.CourseController = CourseController;
