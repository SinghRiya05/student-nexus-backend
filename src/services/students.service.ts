import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";

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
}
