import { userModel } from "../models/user.model";
import StudentProfileModel from "../models/student.profile.model";
import AluminiProfileModel from "../models/alumini.profile";
import TeacherProfileModel from "../models/teacher.profile.model";
import connectDB from "../databases/database";
import { dummyUsers } from "./data/dummy-data";

const seedData = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting bulk seed script (100+ users)...");

    console.log("🧹 Cleaning up existing users and profiles...");
    await userModel.deleteMany({});
    await StudentProfileModel.deleteMany({});
    await AluminiProfileModel.deleteMany({});
    await TeacherProfileModel.deleteMany({});
    console.log("✅ Cleanup complete.");

    for (const userData of dummyUsers) {
      let user: any = await userModel.findOne({ email: userData.email });
      if (!user) {
        user = await userModel.create({
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
        // console.log(`Created user: ${userData.email}`);

        // Create Profile
        if (userData.profile.type === "STUDENT") {
          await StudentProfileModel.create({
            userId: user._id,
            semesterId: userData.semesterId || undefined,
            hobby_badge: userData.profile.hobby_badge,
            skills: userData.profile.skills,
          });
        } else if (userData.profile.type === "ALUMINI") {
          await AluminiProfileModel.create({
            userId: user._id,
            currentCompany: userData.profile.currentCompany,
            jobTitle: userData.profile.jobTitle,
            experienceYears: userData.profile.experienceYears,
            skills: userData.profile.skills,
          });
        } else if (userData.profile.type === "TEACHER") {
          await TeacherProfileModel.create({
            userId: user._id,
            designation: userData.profile.designation,
            department: userData.profile.department,
            experienceYears: userData.profile.experienceYears,
            bio: userData.profile.bio,
          });
        }
      } else {
        // Update password for existing dummy users
        user.password = userData.password;
        await user.save();
      }
    }

    const totalUsers = await userModel.countDocuments({ isDeleted: false });
    console.log(`✅ Seeding completed! Total users in DB: ${totalUsers}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
