import { CourseModel } from "../models/course.model";
import { ICourse } from "../interfaces/masterInterfaces/course.interface";
import { ConflictError, NotFoundError } from "../core/errors";

export class CourseService {

    createCourse = async (courseData: ICourse) => {
        const existingCourse = await CourseModel.findOne({ courseName: courseData.courseName });
        if (existingCourse) throw new ConflictError("Course already exists");
        return await CourseModel.create(courseData);
    }

    getAllCourses = async () => {
        return await CourseModel.find();
    }


    getCourseById = async (id: string) => {
        const existingCourse = await CourseModel.findById(id);
        if (!existingCourse) throw new NotFoundError("Course not found");
        return existingCourse;
    }

    updateCourse = async (id: string, courseData: Partial<ICourse>) => {
        const existingCourse = await CourseModel.findById(id);
        if (!existingCourse) throw new NotFoundError("Course not found");
        if (courseData.courseName) {
            const duplicate = await CourseModel.findOne({
                courseName: courseData.courseName,
                _id: { $ne: id },
            });
            if (duplicate) throw new ConflictError("Course already exists");
        }
        return await CourseModel.findByIdAndUpdate(id, courseData, { new: true, runValidators: true });
    }

    deleteCourse = async (id: string) => {
        const existingCourse = await CourseModel.findById(id);
        if (!existingCourse) throw new NotFoundError("Course not found");
        return await CourseModel.findByIdAndDelete(id);
    }

}