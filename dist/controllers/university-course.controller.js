"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityCourseController = void 0;
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const university_course_service_1 = require("../services/university-course.service");
const catchAsync_1 = require("../core/catchAsync");
const universityCourseService = new university_course_service_1.UniversityCourseService();
class UniversityCourseController {
    constructor() {
        this.assignCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId, courseId } = req.body;
            const result = await universityCourseService.assignCourse(universityId, courseId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Course assigned successfully", result);
        });
        this.syncUniversityCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId, courseIds } = req.body;
            const result = await universityCourseService.syncUniversityCoursesService(universityId, courseIds);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Courses synced successfully", result);
        });
        this.bulkRemoveCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId, courseIds } = req.body;
            const result = await universityCourseService.bulkRemoveCourses(universityId, courseIds);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Courses removed successfully", result);
        });
        this.removeCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId, courseId } = req.body;
            const result = await universityCourseService.removeCourse(universityId, courseId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Course removed successfully", result);
        });
        this.getCoursesByUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const universityId = req.params.id;
            const result = await universityCourseService.getCoursesByUniversity(universityId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Courses fetched successfully", result);
        });
        this.getUniversitiesByCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const courseId = req.params.id;
            const result = await universityCourseService.getUniversitiesByCourse(courseId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Universities fetched successfully", result);
        });
    }
}
exports.UniversityCourseController = UniversityCourseController;
