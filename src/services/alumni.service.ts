import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../core/jwt";
import { refreshTokenModel } from "../models/refreshToken.model";

export class AlumniService {

  // --- GET ALUMNI BY UNIVERSITY ---
  getAluminiByUniversity = async (universityId: string, authUserId: string) => {
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });
    
    if (!alumniRole) {
      throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
    }

    const alumni = await userModel.find({ 
      roleId: alumniRole._id, 
      universityId: universityId,
      _id: { $ne: authUserId },
      isDeleted: false 
    })
    .populate("universityId")
    .populate("courseIds")
    .populate("semesterId")
    .select("-password");

    return alumni;
  };

  
}
