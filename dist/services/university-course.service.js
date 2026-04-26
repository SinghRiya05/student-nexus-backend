"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityCourseService = void 0;
const university_course_model_1 = __importDefault(require("../models/university-course.model"));
const university_model_1 = __importDefault(require("../models/university.model"));
const course_model_1 = require("../models/course.model");
const errors_1 = require("../core/errors");
const mongoose_1 = require("mongoose");
class UniversityCourseService {
    constructor() {
        this.assignCourse = async (universityId, courseId) => {
            const university = await university_model_1.default.findById(universityId);
            if (!university)
                throw new errors_1.NotFoundError("University not found");
            const course = await course_model_1.CourseModel.findById(courseId);
            if (!course)
                throw new errors_1.NotFoundError("Course not found");
            const existing = await university_course_model_1.default.findOne({
                universityId,
                courseId,
            });
            if (existing)
                throw new errors_1.ConflictError("Course already assigned to this university");
            return await university_course_model_1.default.create({
                universityId,
                courseId,
            });
        };
        this.syncUniversityCoursesService = async (universityId, courseIds) => {
            const university = await university_model_1.default.findById(universityId);
            if (!university)
                throw new errors_1.NotFoundError("University not found");
            const existingMappings = await university_course_model_1.default.find({
                universityId,
            });
            const existingCourseIds = existingMappings.map((m) => m.courseId.toString());
            const existingSet = new Set(existingCourseIds);
            const newSet = new Set(courseIds);
            const toAdd = courseIds.filter((id) => !existingSet.has(id));
            const toRemove = existingCourseIds.filter((id) => !newSet.has(id));
            if (toAdd.length > 0) {
                const newData = toAdd.map((courseId) => ({
                    universityId: new mongoose_1.Types.ObjectId(universityId),
                    courseId: new mongoose_1.Types.ObjectId(courseId),
                }));
                await university_course_model_1.default.insertMany(newData, {
                    ordered: false,
                });
            }
            if (toRemove.length > 0) {
                await university_course_model_1.default.deleteMany({
                    universityId,
                    courseId: { $in: toRemove },
                });
            }
            return {
                added: toAdd,
                removed: toRemove,
                totalAssigned: courseIds.length,
            };
        };
        this.getCoursesByUniversity = async (universityId) => {
            const university = await university_model_1.default.findById(universityId);
            if (!university)
                throw new errors_1.NotFoundError("University not found");
            return await university_course_model_1.default.find({ universityId })
                .populate("courseId");
        };
        this.getUniversitiesByCourse = async (courseId) => {
            const course = await course_model_1.CourseModel.findById(courseId);
            if (!course)
                throw new errors_1.NotFoundError("Course not found");
            return await university_course_model_1.default.find({ courseId })
                .populate("universityId");
        };
        this.bulkRemoveCourses = async (universityId, courseIds) => {
            const university = await university_model_1.default.findById(universityId);
            if (!university)
                throw new errors_1.NotFoundError("University not found");
            return await university_course_model_1.default.deleteMany({
                universityId,
                courseId: { $in: courseIds }
            });
        };
        this.removeCourse = async (universityId, courseId) => {
            const existing = await university_course_model_1.default.findOneAndDelete({
                universityId,
                courseId,
            });
            if (!existing)
                throw new errors_1.NotFoundError("Mapping not found");
            return { message: "Course removed from university" };
        };
    }
}
exports.UniversityCourseService = UniversityCourseService;
;
