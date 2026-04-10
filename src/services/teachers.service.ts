import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";

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
      .populate("universityId", "name short_name");
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
      .populate("universityId", "name short_name");
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
      .populate("universityId", "name short_name");
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
}
