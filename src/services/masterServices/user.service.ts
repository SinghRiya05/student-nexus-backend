import { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../../core/errors";
import { signAccessToken, signRefreshToken } from "../../core/jwt";
import { IUser } from "../../interfaces/masterInterfaces/user.interface";
import { courseModel } from "../../models/course.model";
import RoleModel from "../../models/role.model";
import { semesterModel } from "../../models/semester.model";
import UniversityModel from "../../models/university.model";
import { userModel } from "../../models/user.model";
import { STATUS } from "../../config";

export class UserService {
  async createUser(data: IUser) {
    const existingEmail = await userModel.findOne({ email: data.email });
    if (existingEmail) throw new BadRequestError("Email already exists");
    const existingPhone = await userModel.findOne({ phone: data.phone });
    if (existingPhone) throw new BadRequestError("Phone already exists");
    const university = await UniversityModel.findById(data.universityId);
    if (!university) throw new NotFoundError("University not found");
    const course = await courseModel.findById(data.courseId);
    if (!course) throw new NotFoundError("Course not found");

    const semester = await semesterModel.findById(data.semesterId);
    if (!semester) throw new NotFoundError("Semester not found");

    const role = await RoleModel.findById(data.roleId);
    if (!role) throw new NotFoundError("Role not found");

    const user = await userModel.create(data);
    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id });
    return { user, accessToken, refreshToken };
  }

  async login(data: Partial<IUser>) {
    const user = await userModel.findOne({ email: data.email });
    if (!user) throw new BadRequestError("Invalid Credentials");
    const isPasswordValid = await user.comparePassword(data.password!);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
    }
    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async getUsers() {
    return await userModel
      .find({ is_deleted: false })
      .populate("universityId")
      .populate("courseId")
      .populate("semesterId")
      .populate("roleId")
      .sort({ createdAt: -1 });
  }

  async toggleUserStatus(id: string) {
    const user = await userModel.findById(id);
    if (!user) throw new NotFoundError("User not found");
    user.status =
      user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
    await user.save();
    return user;
  }

  async getUserById(id: string) {
    const user = await userModel
      .findOne({ _id: new Types.ObjectId(id), is_deleted: false })
      .populate("universityId")
      .populate("courseId")
      .populate("semesterId")
      .populate("roleId");
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await userModel.findById(id);
    if (!user || user.isDeleted) throw new NotFoundError("User not found");
    if (data.email) {
      const emailExists = await userModel.findOne({
        email: data.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        throw new BadRequestError("Email already exists");
      }
    }
    if (data.phone) {
      const phoneExists = await userModel.findOne({
        phone: data.phone,
        _id: { $ne: id },
      });
      if (phoneExists) {
        throw new BadRequestError("Phone already exists");
      }
    }
    return await userModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate("universityId")
      .populate("courseId")
      .populate("semesterId")
      .populate("roleId");
  }

  async softDeleteUser(id: string) {
    const user = await userModel.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundError("User not found");
    }
    user.isDeleted = true;
    await user.save();
    return user;
  }

  async deleteUser(id: string) {
    const result = await userModel.findByIdAndDelete(id);
    return result;
  }
}
