import UniversityModel from "../models/university.model";
import { IUniversity } from "../interfaces/masterInterfaces/university.interface";
import { ConflictError, NotFoundError } from "../core/errors";
import { userModel } from "../models/user.model";
import UniversityCourseModel from "../models/university-course.model";
import RoleModel from "../models/role.model";

export class UniversityService {

    createUniversity = async (universityData: IUniversity) => {
        const existingUniversity = await UniversityModel.findOne({ name: universityData.name });
        if (existingUniversity) throw new ConflictError("University already exists");
        return await UniversityModel.create(universityData);
    }

    getAllUniversities = async () => {
        const teacherRole = await RoleModel.findOne({ name: "TEACHER" });

        const universities = await UniversityModel.find()
            .populate("country", "name id")
            .populate("state", "name id")
            .populate("city", "name id")
            .lean();

        const universityWithDetails = await Promise.all(universities.map(async (uni) => {
            // Count users in this university
            const userCount = await userModel.countDocuments({ universityId: uni._id });
            const teacherCount = await userModel.countDocuments({ 
                universityId: uni._id, 
                roleId: teacherRole?._id 
            });

            // Fetch and count courses in this university
            const uniCourses = await UniversityCourseModel.find({ universityId: uni._id })
                .populate("courseId", "courseName")
                .lean();

            return {
                ...uni,
                userCount,
                teacherCount,
                courseCount: uniCourses.length,
                courses: uniCourses.map((uc: any) => uc.courseId?.courseName).filter(Boolean)
            };
        }));

        return universityWithDetails;
    }

    getUniversityById = async (id: string) => {

        const existingUniversity = await UniversityModel.findById(id).populate("country", "name id").populate("state", "name id").populate("city", "name id");
        if (!existingUniversity) throw new NotFoundError("University not found");

        const teacherRole = await RoleModel.findOne({ name: "TEACHER" });
        const userCount = await userModel.countDocuments({ universityId: existingUniversity._id });
        const teacherCount = await userModel.countDocuments({ 
            universityId: existingUniversity._id, 
            roleId: teacherRole?._id 
        });

        const uniCourses = await UniversityCourseModel.find({ universityId: existingUniversity._id })
            .populate("courseId", "courseName")
            .lean();

        const universityWithDetails = {
            ...existingUniversity.toObject(),
            userCount,
            teacherCount,
            courseCount: uniCourses.length,
            courses: uniCourses.map((uc: any) => uc.courseId?.courseName).filter(Boolean)
        }
        return universityWithDetails;
    }

    updateUniversity = async (id: string, universityData: Partial<IUniversity>) => {
        const existingUniversity = await UniversityModel.findById(id);
        if (!existingUniversity) throw new NotFoundError("University not found");
        if (universityData.name) {
            const duplicate = await UniversityModel.findOne({
                name: universityData.name,
                _id: { $ne: id },
            });
            if (duplicate) throw new ConflictError("University already exists");
        }
        return await UniversityModel.findByIdAndUpdate(id, universityData, { new: true, runValidators: true });
    }

    deleteUniversity = async (id: string) => {
        const existingUniversity = await UniversityModel.findById(id);
        if (!existingUniversity) throw new NotFoundError("University not found");
        return await UniversityModel.findByIdAndDelete(id);
    }

}