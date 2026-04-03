import UniversityCourseModel from "../models/university-course.model";
import UniversityModel from "../models/university.model";
import { CourseModel } from "../models/course.model";
import { ConflictError, NotFoundError } from "../core/errors";

export class UniversityCourseService {

    assignCourse = async (universityId: string, courseId: string) => {
        const university = await UniversityModel.findById(universityId);
        if (!university) throw new NotFoundError("University not found");
        const course = await CourseModel.findById(courseId);
        if (!course) throw new NotFoundError("Course not found");
        const existing = await UniversityCourseModel.findOne({
            universityId,
            courseId,
        });
        if (existing) throw new ConflictError("Course already assigned to this university");
        return await UniversityCourseModel.create({
            universityId,
            courseId,
        });
    }

    getCoursesByUniversity = async (universityId: string) => {
        const university = await UniversityModel.findById(universityId);
        if (!university) throw new NotFoundError("University not found");
        return await UniversityCourseModel.find({ universityId })
            .populate("courseId");
    }

    getUniversitiesByCourse = async (courseId: string) => {
        const course = await CourseModel.findById(courseId);
        if (!course) throw new NotFoundError("Course not found");
        return await UniversityCourseModel.find({ courseId })
            .populate("universityId");
    }

    removeCourse = async (universityId: string, courseId: string) => {
        const existing = await UniversityCourseModel.findOneAndDelete({
            universityId,
            courseId,
        });
        if (!existing) throw new NotFoundError("Mapping not found");
        return { message: "Course removed from university" };
    }

};