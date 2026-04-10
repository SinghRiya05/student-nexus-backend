import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import StudentProfileModel from "../models/student.profile.model";
import { Types } from "mongoose";

export class StudentService {

  // --- GET ALL STUDENTS ---
  getAllStudents = async () => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });
    if (!studentRole) {
      throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
    }
    const students = await userModel.find({ roleId: studentRole._id, isDeleted: false })
      .populate("universityId")
      .populate("courseIds")
      .populate("semesterId")
      .select("-password");
    return students;
  };

  // --- GET STUDENTS BY UNIVERSITY ---
  getStudentsByUniversity = async (universityId: string, authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });
    if (!studentRole) {
      throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
    }
    const students = await userModel.find({
      roleId: studentRole._id,
      universityId: universityId,
      _id: { $ne: authUserId },
      isDeleted: false
    })
      .populate("universityId")
      .populate("courseIds")
      .populate("semesterId")
      .select("-password");

    return students;
  };


  // ---- GET STUDENTS BY MATCHED hobby_badge ----
  getStudentsByMatchedHobbyBadge = async (hobby_badge: string, universityId: string, authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });

    if (!studentRole) {
      throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
    }

    const students = await userModel.aggregate([
      {
        $match: {
          roleId: studentRole._id,
          universityId: new Types.ObjectId(universityId),
          _id: { $ne: new Types.ObjectId(authUserId) },
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: "studentprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile"
        }
      },
      { $unwind: "$profile" },
      { $match: { "profile.hobby_badge": hobby_badge } },
    ]);

    return students;
  };


  getStudentsByMatchedSemesterWithCourseAndSameUniversity = async (authUserId: string) => {

    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });
    if (!studentRole) {
      throw new Error("Student role not found.");
    }

    // 1. Get logged-in user
    const user = await userModel.findById(authUserId);

    if (
      !user ||
      !user.universityId ||
      !user.semesterId ||
      !user.courseIds ||
      user.courseIds.length === 0
    ) {
      throw new Error("User data not complete.");
    }

    const students = await userModel
      .find({
        roleId: studentRole._id,
        universityId: user.universityId,
        semesterId: user.semesterId,
        courseIds: { $in: user.courseIds }, // ✅ same course
        _id: { $ne: user._id }, // ❌ exclude self
        isDeleted: false,
      })
      .select("-password")
      .populate("universityId", "name short_name")
      .populate("courseIds", "courseName course_short_name")
      .populate("semesterId", "name");

    return students;
  };

  getStudentsByMatchCourseAndSameUniversity = async (authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });

    if (!studentRole) {
      throw new Error("Student role not found.");
    }

    // 1. Get user to get universityId and courseIds
    const user = await userModel.findById(authUserId);
    if (!user || !user.universityId || !user.courseIds || user.courseIds.length === 0) {
      throw new Error("User data, university association, or courses not found.");
    }

    const universityId = user.universityId;
    const courseIds = user.courseIds;

    // 3. Find other students in same university, same semester, and shared courses
    const students = await userModel.aggregate([
      {
        $match: {
          roleId: studentRole._id,
          universityId: new Types.ObjectId(universityId.toString()),
          _id: { $ne: new Types.ObjectId(authUserId) },
          courseIds: { $in: courseIds.map(id => new Types.ObjectId(id.toString())) },
          isDeleted: false
        }
      },
      {
        $project: {
          password: 0
        }
      }

    ]);

    return await userModel.populate(students, [
      { path: "universityId" },
      { path: "courseIds" },
      { path: "semesterId" },
    ]);
  };
}


