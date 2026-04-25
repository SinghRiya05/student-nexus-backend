import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import StudentProfileModel from "../models/student.profile.model";
import { Types } from "mongoose";

export class StudentService {

  // --- GET CURRENT STUDENT FULL DATA ---
  getCurrentStudentData = async (userId: string) => {
    const student = await userModel
      .findById(userId)
      .select("-password")
      .populate("roleId", "name")
      .populate("universityId", "name short_name")
      .populate("courseIds", "courseName course_short_name")
      .lean();
    if (!student) throw new Error("Student not found.");
    // StudentProfile (skills, hobby_badge, projects) ko bhi fetch karo
    const profile = await StudentProfileModel.findOne({ userId })
      .populate("semesterId", "name")
      .lean();
    return {
      ...student,
      studentProfile: profile || null,
    };
  };

  getStudentById = async (userId: string) => {
    const student = await userModel.findById(userId).select("-password").populate("roleId", "name").populate("universityId", "name short_name").populate("courseIds", "courseName course_short_name").lean();
    if (!student) throw new Error("Student not found.");
    const profile = await StudentProfileModel.findOne({ userId }).populate("semesterId", "name").lean();
    return {
      ...student,
      studentProfile: profile || null,
    };
  }


  getAllStudents = async (authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });
    if (!studentRole) {
      throw new Error("Student role not found. Please ensure the 'STUDENT' role exists in the database.");
    }
    const students = await userModel.find({ roleId: studentRole._id, _id: { $ne: authUserId }, isDeleted: false })
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


  getStudentsByMatchedSemesterWithCourseAndSameUniversity = async (authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });
    if (!studentRole) return [];
    const user = await userModel.findById(authUserId);
    if (!user || !user.universityId || !user.courseIds?.length) {
      return [];
    }

    // ✅ get logged-in user's semester
    const authProfile = await StudentProfileModel.findOne({ userId: authUserId });
    if (!authProfile?.semesterId) {
      return [];
    }

    const students = await userModel
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

    const profiles = await StudentProfileModel.find({
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

  getStudentsByMatchCourseAndSameUniversity = async (authUserId: string) => {
    const studentRole = await RoleModel.findOne({ name: "STUDENT", isDeleted: false });

    if (!studentRole) {
      return [];
    }

    // 1. Get user to get universityId and courseIds
    const user = await userModel.findById(authUserId);
    if (!user || !user.universityId || !user.courseIds || user.courseIds.length === 0) {
      return [];
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


