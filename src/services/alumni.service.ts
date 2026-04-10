import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../core/jwt";
import { refreshTokenModel } from "../models/refreshToken.model";

export class AlumniService {
  
  // --- ALUMNI LOGIN ---
  alumniLogin = async (email: string, password: string, ip: string, userAgent: string) => {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    // Check if user has ALUMINI role
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });
    if (!alumniRole) throw new Error("Alumni role configuration not found.");

    if (user.roleId.toString() !== alumniRole._id.toString()) {
      throw new Error("Access denied. This login is restricted to alumni only.");
    }

    if (!user.verificationStatus) throw new Error("User not verified. Please verify your email.");
    if (user.status !== "ACTIVE") throw new Error("User account is not active.");

    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id, ipAddress: ip, userAgent: userAgent });

    await refreshTokenModel.create({ 
      user: user._id, 
      token: refreshToken, 
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      createdByIp: ip 
    });

    return { user, accessToken, refreshToken };
  };

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
