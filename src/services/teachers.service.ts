import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import TeacherResourceModel from "../models/teacher.resources.model";
import { deleteFileIfExists } from "../utils/file.utils";

export class TeacherService {
  private static async getTeacherRoleId() {
    const role = await RoleModel.findOne({ name: "TEACHER" });
    if (!role) throw new Error("Teacher role not found");
    return role._id;
  }

  // Get teachers from the same university as the logged-in student
  static getSameUniversityTeachers = async (universityId: string, authUserId: string) => {
    const teacherRoleId = await this.getTeacherRoleId();

    return await userModel
      .find({
        roleId: teacherRoleId,
        universityId,
        _id: { $ne: authUserId },
        isDeleted: false,
        status: "ACTIVE",
      })
      .populate("teacherProfile")
      .populate("universityId", "name short_name")
      .populate("courseIds", "courseName course_short_name")

  };

  // Get teachers from the same university who share any course or semester with the student
  static getClassTeachers = async (
    universityId: string,
    courseIds: string[],
    semesterId: string | undefined,
    authUserId: string
  ) => {
    const teacherRoleId = await this.getTeacherRoleId();

    const conditions: any[] = [{ courseIds: { $in: courseIds } }];
    if (semesterId) conditions.push({ semesterId });

    return await userModel
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
      .populate("courseIds", "courseName course_short_name")

  };

  // Get teachers from ALL universities except the student's own
  static getOtherUniversityTeachers = async (studentUniversityId: string | undefined, authUserId: string) => {
    const teacherRoleId = await this.getTeacherRoleId();

    const query: any = {
      roleId: teacherRoleId,
      _id: { $ne: authUserId },
      isDeleted: false,
      status: "ACTIVE",
    };

    if (studentUniversityId) {
      query.universityId = { $ne: studentUniversityId };
    }

    return await userModel
      .find(query)
      .populate("teacherProfile")
      .populate("universityId", "name short_name")
      .populate("courseIds", "courseName course_short_name")

  };

  // Get teachers who are associated with a specific course
  static getTeachersByCourse = async (courseId: string, authUserId: string) => {
    const teacherRoleId = await this.getTeacherRoleId();

    return await userModel
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

  // --- TEACHER RESOURCE CRUD ---

  static createResource = async (data: any) => {
    const newResource = new TeacherResourceModel(data);
    return await newResource.save();
  };

  static updateResource = async (resourceId: string, teacherId: string, data: any) => {
    const resource = await TeacherResourceModel.findOne({ _id: resourceId, teacherId });
    if (!resource) {
      throw new Error("Resource not found or unauthorized.");
    }
    
    // If updating the file, delete the old one
    if (data.fileUrl && resource.fileUrl && data.fileUrl !== resource.fileUrl) {
      deleteFileIfExists(resource.fileUrl);
    }

    Object.assign(resource, data);
    return await resource.save();
  };

  static deleteResource = async (resourceId: string, teacherId: string) => {
    const resource = await TeacherResourceModel.findOneAndDelete({ _id: resourceId, teacherId });
    if (!resource) {
      throw new Error("Resource not found or unauthorized.");
    }
    
    if (resource.fileUrl) {
      deleteFileIfExists(resource.fileUrl);
    }
    
    return resource;
  };

  static getTeacherResources = async (teacherId: string) => {
    return await TeacherResourceModel.find({ teacherId })
      .populate("courseId", "courseName course_short_name")
      .populate("semesterId", "semesterNumber")
      .populate("universityId", "name short_name");
  };

  static getResourceById = async (resourceId: string) => {
    const resource = await TeacherResourceModel.findById(resourceId)
      .populate("teacherId", "firstName lastName avatar")
      .populate("courseId", "courseName course_short_name")
      .populate("semesterId", "semesterNumber")
      .populate("universityId", "name short_name");
      
    if (!resource) {
      throw new Error("Resource not found");
    }
    
    return resource;
  };

  static getResourcesForStudents = async (universityId?: string, courseId?: string, semesterId?: string) => {
    const filter: any = {};
    if (universityId) filter.universityId = universityId;
    if (courseId) filter.courseId = courseId;
    if (semesterId) filter.semesterId = semesterId;

    return await TeacherResourceModel.find(filter)
      .populate("teacherId", "firstName lastName avatar")
      .populate("courseId", "courseName")
      .populate("semesterId");
  };
}
