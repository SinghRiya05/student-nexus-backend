"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const user_model_1 = require("../models/user.model");
const role_model_1 = __importDefault(require("../models/role.model"));
const student_profile_model_1 = __importDefault(require("../models/student.profile.model"));
const mongoose_1 = require("mongoose");
class StudentService {
    constructor() {
        // --- GET CURRENT STUDENT FULL DATA ---
        this.getCurrentStudentData = async (userId) => {
            const student = await user_model_1.userModel
                .findById(userId)
                .select("-password")
                .populate("roleId", "name")
                .populate("universityId", "name short_name")
                .populate("courseIds", "courseName course_short_name")
                .lean();
            if (!student)
                throw new Error("Student not found.");
            // StudentProfile (skills, hobby_badge, projects) ko bhi fetch karo
            const profile = await student_profile_model_1.default.findOne({ userId })
                .populate("semesterId", "name")
                .lean();
            return {
                ...student,
                studentProfile: profile || null,
            };
        };
        this.getStudentById = async (userId) => {
            const student = await user_model_1.userModel.findById(userId).select("-password").populate("roleId", "name").populate("universityId", "name short_name").populate("courseIds", "courseName course_short_name").lean();
            if (!student)
                throw new Error("Student not found.");
            const profile = await student_profile_model_1.default.findOne({ userId }).populate("semesterId", "name").lean();
            return {
                ...student,
                studentProfile: profile || null,
            };
        };
        this.getAllStudents = async (authUserId) => {
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT", isDeleted: false });
            if (!studentRole) {
                throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
            }
            const students = await user_model_1.userModel.find({ roleId: studentRole._id, _id: { $ne: authUserId }, isDeleted: false })
                .populate("universityId")
                .populate("courseIds")
                .populate({
                path: "studentProfile",
                populate: {
                    path: "semesterId",
                    select: "name"
                }
            })
                .select("-password");
            return students;
        };
        // --- GET STUDENTS BY UNIVERSITY ---
        this.getStudentsByUniversity = async (universityId, authUserId) => {
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT", isDeleted: false });
            if (!studentRole) {
                throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
            }
            const students = await user_model_1.userModel.find({
                roleId: studentRole._id,
                universityId: universityId,
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate({
                path: "studentProfile",
                populate: {
                    path: "semesterId",
                    select: "name"
                }
            })
                .select("-password");
            return students;
        };
        // ---- GET STUDENTS BY MATCHED hobby_badge ----
        this.getStudentsByMatchedHobbyBadge = async (hobby_badge, universityId, authUserId) => {
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT", isDeleted: false });
            if (!studentRole) {
                throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
            }
            const students = await user_model_1.userModel.aggregate([
                {
                    $match: {
                        roleId: studentRole._id,
                        universityId: new mongoose_1.Types.ObjectId(universityId),
                        _id: { $ne: new mongoose_1.Types.ObjectId(authUserId) },
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: "studentprofiles",
                        localField: "_id",
                        foreignField: "userId",
                        as: "studentProfile"
                    }
                },
                { $unwind: "$studentProfile" },
                {
                    $lookup: {
                        from: "semesters",
                        localField: "studentProfile.semesterId",
                        foreignField: "_id",
                        as: "studentProfile.semesterId"
                    }
                },
                { $unwind: "$studentProfile.semesterId" },
                { $match: { "studentProfile.hobby_badge": hobby_badge } },
            ]);
            return students;
        };
        this.getStudentsByMatchedSemesterWithCourseAndSameUniversity = async (authUserId) => {
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT", isDeleted: false });
            if (!studentRole)
                return [];
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user || !user.universityId || !user.courseIds?.length) {
                return [];
            }
            // ✅ get logged-in user's semester
            const authProfile = await student_profile_model_1.default.findOne({ userId: authUserId });
            if (!authProfile?.semesterId) {
                return [];
            }
            const students = await user_model_1.userModel
                .find({
                roleId: studentRole._id,
                universityId: user.universityId,
                courseIds: { $in: user.courseIds },
                _id: { $ne: user._id },
                isDeleted: false,
            })
                .select("-password")
                .populate("universityId", "name short_name")
                .populate("courseIds", "courseName course_short_name");
            const profiles = await student_profile_model_1.default.find({
                userId: { $in: students.map(s => s._id) },
                semesterId: authProfile.semesterId // ✅ KEY FIX
            }).populate("semesterId", "name");
            const profileMap = new Map();
            profiles.forEach(p => {
                profileMap.set(p.userId.toString(), p);
            });
            const result = students
                .filter(student => profileMap.has(student._id.toString()))
                .map(student => ({
                ...student.toObject(),
                studentProfile: profileMap.get(student._id.toString())
            }));
            return result;
        };
        this.getStudentsByMatchCourseAndSameUniversity = async (authUserId) => {
            const studentRole = await role_model_1.default.findOne({ name: "STUDENT", isDeleted: false });
            if (!studentRole) {
                return [];
            }
            // 1. Get user to get universityId and courseIds
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user || !user.universityId || !user.courseIds || user.courseIds.length === 0) {
                return [];
            }
            const universityId = user.universityId;
            const courseIds = user.courseIds;
            // 3. Find other students in same university, same semester, and shared courses
            const students = await user_model_1.userModel.aggregate([
                {
                    $match: {
                        roleId: studentRole._id,
                        universityId: new mongoose_1.Types.ObjectId(universityId.toString()),
                        _id: { $ne: new mongoose_1.Types.ObjectId(authUserId) },
                        courseIds: { $in: courseIds.map(id => new mongoose_1.Types.ObjectId(id.toString())) },
                        isDeleted: false
                    }
                },
                {
                    $project: {
                        password: 0
                    }
                }
            ]);
            return await user_model_1.userModel.populate(students, [
                { path: "universityId" },
                { path: "courseIds" },
                {
                    path: "studentProfile",
                    populate: {
                        path: "semesterId",
                        select: "name"
                    }
                }
            ]);
        };
    }
}
exports.StudentService = StudentService;
