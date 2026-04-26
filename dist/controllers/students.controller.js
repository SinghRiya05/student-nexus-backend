"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const students_service_1 = require("../services/students.service");
const catchAsync_1 = require("../core/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const student_profile_model_1 = __importDefault(require("../models/student.profile.model"));
const studentService = new students_service_1.StudentService();
class StudentController {
    constructor() {
        // --- GET CURRENT STUDENT DATA (my own profile) ---
        this.getCurrentStudentData = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const data = await studentService.getCurrentStudentData(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Current student data fetched successfully.", data);
        });
        // --- GET ALL STUDENTS ---
        this.getAllStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            const students = await studentService.getAllStudents(user?._id?.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Students fetched successfully.", students);
        });
        // --- GET STUDENTS FROM MY UNIVERSITY ---
        this.getStudentsByMyUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId) {
                throw new Error("User's university association not found.");
            }
            const students = await studentService.getStudentsByUniversity(user.universityId.toString(), user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Students from your university fetched successfully.", students);
        });
        this.getStudentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const id = req.params.id;
            const student = await studentService.getStudentById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Student fetched successfully.", student);
        });
        // --- GET STUDENTS BY MATCHED HOBBY BADGE ---
        this.getStudentsByMatchedHobbyBadge = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId) {
                throw new Error("User's university association not found.");
            }
            const userProfile = await student_profile_model_1.default.findOne({ userId: user._id });
            if (!userProfile || !userProfile.hobby_badge) {
                return (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Please set a hobby badge in your profile to find matches.", []);
            }
            const students = await studentService.getStudentsByMatchedHobbyBadge(userProfile.hobby_badge, user.universityId.toString(), user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Students with matching hobby badge fetched successfully.", students);
        });
        // --- GET STUDENTS BY MATCHED SEMESTER WITH COURSE AND SAME UNIVERSITY ---
        this.getStudentsByMatchedSemesterWithCourseAndSameUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId) {
                return (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "University association not found.", []);
            }
            const students = await studentService.getStudentsByMatchedSemesterWithCourseAndSameUniversity(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Students with matching semester, course, and same university fetched successfully.", students);
        });
        this.getStudentsByMatchCourseAndSameUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId) {
                return (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "University association not found.", []);
            }
            const students = await studentService.getStudentsByMatchCourseAndSameUniversity(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Students with matching course and same university fetched successfully.", students);
        });
    }
}
exports.StudentController = StudentController;
