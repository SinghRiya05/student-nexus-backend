import UniversityCourseModel from "../models/university-course.model";
import UniversityModel from "../models/university.model";
import { CourseModel } from "../models/course.model";
import { ConflictError, NotFoundError } from "../core/errors";
import { Types } from "mongoose";

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

    syncUniversityCoursesService = async (
        universityId: string,
        courseIds: string[]
    ) => {
        const university = await UniversityModel.findById(universityId);
        if (!university) throw new NotFoundError("University not found");
        const existingMappings = await UniversityCourseModel.find({
            universityId,
        });
        const existingCourseIds = existingMappings.map((m) =>
            m.courseId.toString()
        );
        const existingSet = new Set(existingCourseIds);
        const newSet = new Set(courseIds);
        const toAdd = courseIds.filter((id) => !existingSet.has(id));
        const toRemove = existingCourseIds.filter((id) => !newSet.has(id));
        if (toAdd.length > 0) {
            const newData = toAdd.map((courseId) => ({
                universityId: new Types.ObjectId(universityId),
                courseId: new Types.ObjectId(courseId),
            }));
            await UniversityCourseModel.insertMany(newData, {
                ordered: false,
            });
        }
        if (toRemove.length > 0) {
            await UniversityCourseModel.deleteMany({
                universityId,
                courseId: { $in: toRemove },
            });
        }
        return {
            added: toAdd,
            removed: toRemove,
            totalAssigned: courseIds.length,
        };
    };

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

    bulkRemoveCourses = async (universityId: string, courseIds: string[]) => {
        const university = await UniversityModel.findById(universityId);
        if (!university) throw new NotFoundError("University not found");
        return await UniversityCourseModel.deleteMany({
            universityId,
            courseId: { $in: courseIds }
        });
    };

    removeCourse = async (universityId: string, courseId: string) => {
        const existing = await UniversityCourseModel.findOneAndDelete({
            universityId,
            courseId,
        });
        if (!existing) throw new NotFoundError("Mapping not found");
        return { message: "Course removed from university" };
    }

};