"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const course_model_1 = require("../models/course.model");
const errors_1 = require("../core/errors");
class CourseService {
    constructor() {
        this.createCourse = async (courseData) => {
            const existingCourse = await course_model_1.CourseModel.findOne({ courseName: courseData.courseName });
            if (existingCourse)
                throw new errors_1.ConflictError("Course already exists");
            return await course_model_1.CourseModel.create(courseData);
        };
        this.getAllCourses = async () => {
            return await course_model_1.CourseModel.find();
        };
        this.getCourseById = async (id) => {
            const existingCourse = await course_model_1.CourseModel.findById(id);
            if (!existingCourse)
                throw new errors_1.NotFoundError("Course not found");
            return existingCourse;
        };
        this.updateCourse = async (id, courseData) => {
            const existingCourse = await course_model_1.CourseModel.findById(id);
            if (!existingCourse)
                throw new errors_1.NotFoundError("Course not found");
            if (courseData.courseName) {
                const duplicate = await course_model_1.CourseModel.findOne({
                    courseName: courseData.courseName,
                    _id: { $ne: id },
                });
                if (duplicate)
                    throw new errors_1.ConflictError("Course already exists");
            }
            return await course_model_1.CourseModel.findByIdAndUpdate(id, courseData, { new: true, runValidators: true });
        };
        this.deleteCourse = async (id) => {
            const existingCourse = await course_model_1.CourseModel.findById(id);
            if (!existingCourse)
                throw new errors_1.NotFoundError("Course not found");
            return await course_model_1.CourseModel.findByIdAndDelete(id);
        };
    }
}
exports.CourseService = CourseService;
