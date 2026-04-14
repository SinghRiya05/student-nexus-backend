import { userModel } from "../models/user.model";
import RoleModel from "../models/role.model";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../core/jwt";
import { refreshTokenModel } from "../models/refreshToken.model";
import AluminiProfileModel from "../models/alumini.profile";

export class AlumniService {

  // --- GET ALUMNI BY MY UNIVERSITY ---
  getAluminiByMyUniversity = async (authUserId: string) => {
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });

    if (!alumniRole) {
      throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
    }

    const user = await userModel.findById(authUserId);
    if (!user) {
      throw new Error("User not found.");
    }

    const alumni = await userModel.find({
      roleId: alumniRole._id,
      universityId: user.universityId,
      _id: { $ne: authUserId },
      isDeleted: false
    })
      .populate("universityId")
      .populate("courseIds")
      .populate("aluminiProfile")
      .select("-password");

    return alumni;
  };


  // --- GET ALUMNI BY MY COURSE ---
  getAluminiByMyCourse = async (authUserId: string) => {
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });

    if (!alumniRole) {
      throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
    }

    const user = await userModel.findById(authUserId);
    if (!user) {
      throw new Error("User not found.");
    }

    const alumni = await userModel.find({
      roleId: alumniRole._id,
      courseIds: { $in: user.courseIds },
      _id: { $ne: authUserId },
      isDeleted: false
    })
      .populate("universityId")
      .populate("courseIds")
      .populate("aluminiProfile")
      .select("-password");

    return alumni;
  };


  // GET ALUMNI BY UNIVERSITY
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
      .populate("aluminiProfile")
      .select("-password");

    return alumni;
  };



  //  GET ALUMNI BY JOB TITLES WITH SAME UNIVERSITY OF AUTHUSER
  getAluminiByJobTitles = async (authUserId: string) => {
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });

    if (!alumniRole) {
      throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
    }

    const user = await userModel.findById(authUserId);
    if (!user) {
      throw new Error("User not found.");
    }

    const alumni = await userModel.find({
      roleId: alumniRole._id,
      universityId: user.universityId,
      _id: { $ne: authUserId },
      isDeleted: false
    })
      .populate("universityId")
      .populate("courseIds")
      .populate("aluminiProfile")
      .select("-password");

    const groupedMap = alumni.reduce((acc: any, curr: any) => {
      const jobTitle = curr.aluminiProfile?.jobTitle || "Other";

      if (!acc[jobTitle]) {
        acc[jobTitle] = [];
      }
      acc[jobTitle].push(curr);

      return acc;
    }, {});

    const groupedAlumni = Object.keys(groupedMap).map(jobTitle => ({
      jobTitle,
      alumni: groupedMap[jobTitle]
    }));

    return groupedAlumni;
  };



  // GET ALUMNI BY COMPANY WITH SAME UNIVERSITY OF AUTHUSER
  getAluminiByCompany = async (authUserId: string) => {
    const alumniRole = await RoleModel.findOne({ name: "ALUMINI", isDeleted: false });

    if (!alumniRole) {
      throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
    }

    const user = await userModel.findById(authUserId);
    if (!user) {
      throw new Error("User not found.");
    }

    const alumni = await userModel.find({
      roleId: alumniRole._id,
      universityId: user.universityId,
      _id: { $ne: authUserId },
      isDeleted: false
    })
      .populate("universityId")
      .populate("courseIds")
      .populate("aluminiProfile")
      .select("-password");

    const groupedMap = alumni.reduce((acc: any, curr: any) => {
      const company = curr.aluminiProfile?.currentCompany || "Other";

      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(curr);

      return acc;
    }, {});

    const groupedAlumni = Object.keys(groupedMap).map(company => ({
      company,
      alumni: groupedMap[company]
    }));

    return groupedAlumni;
  };

}
