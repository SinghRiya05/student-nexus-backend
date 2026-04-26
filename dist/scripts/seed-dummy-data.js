"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const student_profile_model_1 = __importDefault(require("../models/student.profile.model"));
const alumini_profile_1 = __importDefault(require("../models/alumini.profile"));
const teacher_profile_model_1 = __importDefault(require("../models/teacher.profile.model"));
const database_1 = __importDefault(require("../databases/database"));
const dummy_data_1 = require("./data/dummy-data");
const seedData = async () => {
    try {
        await (0, database_1.default)();
        console.log("🌱 Starting bulk seed script (100+ users)...");
        console.log("🧹 Cleaning up existing users and profiles...");
        await user_model_1.userModel.deleteMany({});
        await student_profile_model_1.default.deleteMany({});
        await alumini_profile_1.default.deleteMany({});
        await teacher_profile_model_1.default.deleteMany({});
        console.log("✅ Cleanup complete.");
        for (const userData of dummy_data_1.dummyUsers) {
            let user = await user_model_1.userModel.findOne({ email: userData.email });
            if (!user) {
                user = await user_model_1.userModel.create({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    roleId: userData.roleId,
                    universityId: userData.universityId,
                    courseIds: userData.courseIds,
                    semesterId: userData.semesterId || undefined,
                    verificationStatus: true,
                    status: "ACTIVE",
                    isDeleted: false,
                });
                // Create Profile
                if (userData.profile.type === "STUDENT") {
                    await student_profile_model_1.default.create({
                        userId: user._id,
                        semesterId: userData.semesterId || undefined,
                        hobby_badge: userData.profile.hobby_badge,
                        skills: userData.profile.skills,
                        projects: userData.profile.projects,
                    });
                }
                else if (userData.profile.type === "ALUMINI") {
                    await alumini_profile_1.default.create({
                        userId: user._id,
                        currentCompany: userData.profile.currentCompany,
                        jobTitle: userData.profile.jobTitle,
                        experienceYears: userData.profile.experienceYears,
                        skills: userData.profile.skills,
                        projects: userData.profile.projects,
                    });
                }
                else if (userData.profile.type === "TEACHER") {
                    await teacher_profile_model_1.default.create({
                        userId: user._id,
                        designation: userData.profile.designation,
                        department: userData.profile.department,
                        experienceYears: userData.profile.experienceYears,
                        bio: userData.profile.bio,
                    });
                }
            }
            else {
                // Update password for existing dummy users
                user.password = userData.password;
                await user.save();
            }
        }
        const totalUsers = await user_model_1.userModel.countDocuments({ isDeleted: false });
        console.log(`✅ Seeding completed! Total users in DB: ${totalUsers}`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};
seedData();
