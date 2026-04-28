import { Request, Response } from "express";
import { userModel } from "../models/user.model";
import UniversityModel from "../models/university.model";
import { CourseModel } from "../models/course.model";
import CountryModel from "../models/country.model";
import { FeedModel } from "../models/feed.model";
import TeacherProfileModel from "../models/teacher.profile.model";
import StudentProfileModel from "../models/student.profile.model";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import { catchAsync } from "../core/catchAsync";

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const [
        totalStudents,
        totalTeachers,
        totalUniversities,
        totalCourses,
        totalCountries,
        totalFeeds,
        recentUsers,
        recentFeeds
    ] = await Promise.all([
        StudentProfileModel.countDocuments({}),
        TeacherProfileModel.countDocuments({}),
        UniversityModel.countDocuments({}),
        CourseModel.countDocuments({}),
        CountryModel.countDocuments({}),
        FeedModel.countDocuments({}),
        userModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("firstName lastName email avatar createdAt"),
        FeedModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("authorId", "firstName lastName avatar")
    ]);

    sendResponse(res, STATUS_CODES.SUCCESS, true, "Dashboard stats", {
        stats: {
            totalStudents,
            totalTeachers,
            totalUniversities,
            totalCourses,
            totalCountries,
            totalFeeds
        },
        recentUsers,
        recentFeeds
    }
    );
});
