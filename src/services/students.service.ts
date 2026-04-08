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
      {
        $lookup: {
          from: "universities",
          localField: "universityId",
          foreignField: "_id",
          as: "universityId"
        }
      },
      { $unwind: { path: "$universityId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "semesters",
          localField: "semesterId",
          foreignField: "_id",
          as: "semesterId"
        }
      },
      { $unwind: { path: "$semesterId", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          password: 0,
          "profile.projects": 0,
          "profile.skills": 0
        }
      }
    ]);

    return students;
  };

}
