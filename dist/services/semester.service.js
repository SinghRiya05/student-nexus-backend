"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterService = void 0;
const semester_model_1 = __importDefault(require("../models/semester.model"));
const errors_1 = require("../core/errors");
const course_model_1 = require("../models/course.model");
class SemesterService {
    constructor() {
        this.createSemester = async (semesterData) => {
            const course = await course_model_1.CourseModel.findById(semesterData.courseId);
            if (!course)
                throw new errors_1.NotFoundError("Course not found");
            const existing = await semester_model_1.default.findOne({
                number: semesterData.number,
                courseId: semesterData.courseId
            });
            if (existing)
                throw new errors_1.ConflictError("Semester already exists");
            return await semester_model_1.default.create(semesterData);
        };
        this.getAllSemesters = async () => {
            return await semester_model_1.default.find().populate("courseId");
        };
        this.getSemesterById = async (id) => {
            const existingSemester = await semester_model_1.default.findById(id);
            if (!existingSemester)
                throw new errors_1.NotFoundError("Semester not found");
            return existingSemester.populate("courseId");
        };
        this.updateSemester = async (id, semesterData) => {
            const existingSemester = await semester_model_1.default.findById(id);
            if (!existingSemester)
                throw new errors_1.NotFoundError("Semester not found");
            const number = semesterData.number ?? existingSemester.number;
            const courseId = existingSemester.courseId;
            const duplicate = await semester_model_1.default.findOne({
                number,
                courseId,
                _id: { $ne: id },
            });
            if (duplicate)
                throw new errors_1.ConflictError("Semester already exists");
            delete semesterData.courseId;
            return await semester_model_1.default.findByIdAndUpdate(id, semesterData, { new: true, runValidators: true });
        };
        this.getSemestersByCourseId = async (id) => {
            const course = await course_model_1.CourseModel.findById(id);
            if (!course)
                throw new errors_1.NotFoundError("Course not found");
            return await semester_model_1.default.find({ courseId: id });
        };
        this.deleteSemester = async (id) => {
            const existingSemester = await semester_model_1.default.findById(id);
            if (!existingSemester)
                throw new errors_1.NotFoundError("Semester not found");
            return await semester_model_1.default.findByIdAndDelete(id);
        };
    }
}
exports.SemesterService = SemesterService;
