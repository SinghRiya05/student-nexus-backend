"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const user_model_1 = require("../models/user.model");
const role_model_1 = __importDefault(require("../models/role.model"));
const teacher_resources_model_1 = __importDefault(require("../models/teacher.resources.model"));
const file_utils_1 = require("../utils/file.utils");
class TeacherService {
    static async getTeacherRoleId() {
        const role = await role_model_1.default.findOne({ name: "TEACHER" });
        if (!role)
            throw new Error("Teacher role not found");
        return role._id;
    }
}
exports.TeacherService = TeacherService;
_a = TeacherService;
// Get teachers from the same university as the logged-in student
TeacherService.getSameUniversityTeachers = async (universityId, authUserId) => {
    const teacherRoleId = await _a.getTeacherRoleId();
    return await user_model_1.userModel
        .find({
        roleId: teacherRoleId,
        universityId,
        _id: { $ne: authUserId },
        isDeleted: false,
        status: "ACTIVE",
    })
        .populate("teacherProfile")
        .populate("universityId", "name short_name")
        .populate("courseIds", "courseName course_short_name");
};
// Get teachers from the same university who share any course or semester with the student
TeacherService.getClassTeachers = async (universityId, courseIds, semesterId, authUserId) => {
    const teacherRoleId = await _a.getTeacherRoleId();
    const conditions = [{ courseIds: { $in: courseIds } }];
    if (semesterId)
        conditions.push({ semesterId });
    return await user_model_1.userModel
        .find({
        roleId: teacherRoleId,
        universityId,
        $or: conditions,
        _id: { $ne: authUserId },
        isDeleted: false,
        status: "ACTIVE",
    })
        .populate("teacherProfile")
        .populate("universityId", "name short_name")
        .populate("courseIds", "courseName course_short_name");
};
// Get teachers from ALL universities except the student's own
TeacherService.getOtherUniversityTeachers = async (studentUniversityId, authUserId) => {
    const teacherRoleId = await _a.getTeacherRoleId();
    const query = {
        roleId: teacherRoleId,
        _id: { $ne: authUserId },
        isDeleted: false,
        status: "ACTIVE",
    };
    if (studentUniversityId) {
        query.universityId = { $ne: studentUniversityId };
    }
    return await user_model_1.userModel
        .find(query)
        .populate("teacherProfile")
        .populate("universityId", "name short_name")
        .populate("courseIds", "courseName course_short_name");
};
// Get teachers who are associated with a specific course
TeacherService.getTeachersByCourse = async (courseId, authUserId) => {
    const teacherRoleId = await _a.getTeacherRoleId();
    return await user_model_1.userModel
        .find({
        roleId: teacherRoleId,
        courseIds: courseId,
        _id: { $ne: authUserId },
        isDeleted: false,
        status: "ACTIVE",
    })
        .populate("teacherProfile")
        .populate("universityId", "name short_name")
        .populate("courseIds", "courseName course_short_name");
};
//-----Get Teacher by ID
TeacherService.getTeacherById = async (teacherId) => {
    return await user_model_1.userModel
        .findById(teacherId)
        .populate("teacherProfile")
        .populate("universityId", "name short_name")
        .populate("courseIds", "courseName course_short_name");
};
// --- TEACHER RESOURCE CRUD ---
TeacherService.createResource = async (data) => {
    const newResource = new teacher_resources_model_1.default(data);
    const savedResource = await newResource.save();
    return await savedResource.populate([
        { path: "teacherId", select: "firstName lastName avatar" },
        { path: "courseId", select: "courseName course_short_name" },
        { path: "universityId", select: "name short_name" }
    ]);
};
TeacherService.updateResource = async (resourceId, teacherId, data) => {
    const resource = await teacher_resources_model_1.default.findOne({ _id: resourceId, teacherId });
    if (!resource) {
        throw new Error("Resource not found or unauthorized.");
    }
    // If updating the file, delete the old one
    if (data.fileUrl && resource.fileUrl && data.fileUrl !== resource.fileUrl) {
        (0, file_utils_1.deleteFileIfExists)(resource.fileUrl);
    }
    Object.assign(resource, data);
    const updatedResource = await resource.save();
    return await updatedResource.populate([
        { path: "teacherId", select: "firstName lastName avatar" },
        { path: "courseId", select: "courseName course_short_name" },
        { path: "universityId", select: "name short_name" }
    ]);
};
TeacherService.deleteResource = async (resourceId, teacherId) => {
    const resource = await teacher_resources_model_1.default.findOneAndDelete({ _id: resourceId, teacherId });
    if (!resource) {
        throw new Error("Resource not found or unauthorized.");
    }
    if (resource.fileUrl) {
        (0, file_utils_1.deleteFileIfExists)(resource.fileUrl);
    }
    return resource;
};
TeacherService.getTeacherResources = async (teacherId) => {
    return await teacher_resources_model_1.default.find({ teacherId })
        .populate("teacherId", "firstName lastName avatar")
        .populate("courseId", "courseName course_short_name")
        .populate("universityId", "name short_name")
        .populate("semesterId", "name");
};
TeacherService.getResourceById = async (resourceId) => {
    const resource = await teacher_resources_model_1.default.findById(resourceId)
        .populate("teacherId", "firstName lastName avatar")
        .populate("courseId", "courseName course_short_name")
        .populate("universityId", "name short_name")
        .populate("semesterId", "name");
    if (!resource) {
        throw new Error("Resource not found");
    }
    return resource;
};
TeacherService.getResourcesForStudents = async (universityId, courseId, semesterId) => {
    const filter = {};
    if (universityId)
        filter.universityId = universityId;
    if (courseId)
        filter.courseId = courseId;
    if (semesterId)
        filter.semesterId = semesterId;
    return await teacher_resources_model_1.default.find(filter)
        .populate("teacherId", "firstName lastName avatar")
        .populate("courseId", "courseName")
        .populate("semesterId");
};
