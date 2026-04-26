"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherController = void 0;
const teachers_service_1 = require("../services/teachers.service");
const catchAsync_1 = require("../core/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
class TeacherController {
    constructor() {
        // GET /teachers/same-university
        this.getSameUniversityTeachers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user?.universityId) {
                throw new Error("User's university association not found.");
            }
            const teachers = await teachers_service_1.TeacherService.getSameUniversityTeachers(user.universityId.toString(), user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Same university teachers fetched successfully.", teachers);
        });
        // GET /teachers/class-teachers
        this.getClassTeachers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user?.universityId) {
                throw new Error("User's university association not found.");
            }
            const teachers = await teachers_service_1.TeacherService.getClassTeachers(user.universityId.toString(), (user.courseIds || []).map((id) => id.toString()), user.semesterId?.toString(), user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Class teachers fetched successfully.", teachers);
        });
        // GET /teachers/other-universities
        this.getOtherUniversityTeachers = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const teachers = await teachers_service_1.TeacherService.getOtherUniversityTeachers(user?.universityId?.toString(), user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Teachers from other universities fetched successfully.", teachers);
        });
        // GET /teachers/by-course/:courseId
        this.getTeachersByCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const courseId = req.params.courseId;
            if (!courseId) {
                throw new Error("courseId parameter is required.");
            }
            const teachers = await teachers_service_1.TeacherService.getTeachersByCourse(courseId, user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Teachers for the specified course fetched successfully.", teachers);
        });
        // GET /teachers/:id
        this.getTeacherById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const teacherId = req.params.id;
            if (!teacherId) {
                throw new Error("teacherId parameter is required.");
            }
            const teacher = await teachers_service_1.TeacherService.getTeacherById(teacherId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Teacher fetched successfully.", teacher);
        });
        // --- TEACHER RESOURCE CRUD ---
        this.createResource = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const data = req.body || {};
            if (req.file) {
                data.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
            }
            data.teacherId = user._id;
            if (user.universityId) {
                data.universityId = user.universityId;
            }
            const resource = await teachers_service_1.TeacherService.createResource(data);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Resource uploaded successfully.", resource);
        });
        this.updateResource = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const resourceId = req.params.resourceId;
            const data = req.body || {};
            if (req.file) {
                data.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
            }
            const resource = await teachers_service_1.TeacherService.updateResource(resourceId, user._id.toString(), data);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Resource updated successfully.", resource);
        });
        this.deleteResource = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const resourceId = req.params.resourceId;
            const resource = await teachers_service_1.TeacherService.deleteResource(resourceId, user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Resource deleted successfully.", resource);
        });
        this.getResourceById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const resourceId = req.params.resourceId;
            if (!resourceId) {
                throw new Error("resourceId parameter is required.");
            }
            const resource = await teachers_service_1.TeacherService.getResourceById(resourceId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Resource fetched successfully.", resource);
        });
        this.getTeacherResources = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { teacherId } = req.params;
            // If no teacherId param, default to the logged-in user
            const targetTeacherId = teacherId || req.user._id.toString();
            const resources = await teachers_service_1.TeacherService.getTeacherResources(targetTeacherId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Resources fetched successfully.", resources);
        });
        this.getResourcesForStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId, courseId, semesterId } = req.query;
            const resources = await teachers_service_1.TeacherService.getResourcesForStudents(universityId, courseId, semesterId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Student resources fetched successfully.", resources);
        });
    }
}
exports.TeacherController = TeacherController;
