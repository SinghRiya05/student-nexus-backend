"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityService = void 0;
const university_model_1 = __importDefault(require("../models/university.model"));
const errors_1 = require("../core/errors");
const user_model_1 = require("../models/user.model");
const university_course_model_1 = __importDefault(require("../models/university-course.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
class UniversityService {
    constructor() {
        this.createUniversity = async (universityData) => {
            const existingUniversity = await university_model_1.default.findOne({ name: universityData.name });
            if (existingUniversity)
                throw new errors_1.ConflictError("University already exists");
            return await university_model_1.default.create(universityData);
        };
        this.getAllUniversities = async () => {
            const teacherRole = await role_model_1.default.findOne({ name: "TEACHER" });
            const universities = await university_model_1.default.find()
                .populate("country", "name id")
                .populate("state", "name id")
                .populate("city", "name id")
                .lean();
            const universityWithDetails = await Promise.all(universities.map(async (uni) => {
                // Count users in this university
                const userCount = await user_model_1.userModel.countDocuments({ universityId: uni._id });
                const teacherCount = await user_model_1.userModel.countDocuments({
                    universityId: uni._id,
                    roleId: teacherRole?._id
                });
                // Fetch and count courses in this university
                const uniCourses = await university_course_model_1.default.find({ universityId: uni._id })
                    .populate("courseId", "courseName")
                    .lean();
                return {
                    ...uni,
                    userCount,
                    teacherCount,
                    courseCount: uniCourses.length,
                    courses: uniCourses.map((uc) => uc.courseId?.courseName).filter(Boolean)
                };
            }));
            return universityWithDetails;
        };
        this.getUniversityById = async (id) => {
            const existingUniversity = await university_model_1.default.findById(id).populate("country", "name id").populate("state", "name id").populate("city", "name id");
            if (!existingUniversity)
                throw new errors_1.NotFoundError("University not found");
            const teacherRole = await role_model_1.default.findOne({ name: "TEACHER" });
            const userCount = await user_model_1.userModel.countDocuments({ universityId: existingUniversity._id });
            const teacherCount = await user_model_1.userModel.countDocuments({
                universityId: existingUniversity._id,
                roleId: teacherRole?._id
            });
            const uniCourses = await university_course_model_1.default.find({ universityId: existingUniversity._id })
                .populate("courseId", "courseName")
                .lean();
            const universityWithDetails = {
                ...existingUniversity.toObject(),
                userCount,
                teacherCount,
                courseCount: uniCourses.length,
                courses: uniCourses.map((uc) => uc.courseId?.courseName).filter(Boolean)
            };
            return universityWithDetails;
        };
        this.updateUniversity = async (id, universityData) => {
            const existingUniversity = await university_model_1.default.findById(id);
            if (!existingUniversity)
                throw new errors_1.NotFoundError("University not found");
            if (universityData.name) {
                const duplicate = await university_model_1.default.findOne({
                    name: universityData.name,
                    _id: { $ne: id },
                });
                if (duplicate)
                    throw new errors_1.ConflictError("University already exists");
            }
            return await university_model_1.default.findByIdAndUpdate(id, universityData, { new: true, runValidators: true });
        };
        this.deleteUniversity = async (id) => {
            const existingUniversity = await university_model_1.default.findById(id);
            if (!existingUniversity)
                throw new errors_1.NotFoundError("University not found");
            return await university_model_1.default.findByIdAndDelete(id);
        };
    }
}
exports.UniversityService = UniversityService;
