import SemesterModel from "../models/semester.model";
import { ISemester } from "../interfaces/masterInterfaces/semester.interface";
import { ConflictError, NotFoundError } from "../core/errors";
import { CourseModel } from "../models/course.model";

export class SemesterService {
    createSemester = async (semesterData: ISemester) => {
        const course = await CourseModel.findById(semesterData.courseId);
        if (!course) throw new NotFoundError("Course not found");
        const existing = await SemesterModel.findOne({
            number: semesterData.number,
            courseId: semesterData.courseId
        });
        if (existing) throw new ConflictError("Semester already exists");
        return await SemesterModel.create(semesterData);
    }

    getAllSemesters = async () => {
        return await SemesterModel.find().populate("courseId");
    }

    getSemesterById = async (id: string) => {
        const existingSemester = await SemesterModel.findById(id);
        if (!existingSemester) throw new NotFoundError("Semester not found");
        return existingSemester.populate("courseId");
    }

    updateSemester = async (id: string, semesterData: Partial<ISemester>) => {
        const existingSemester = await SemesterModel.findById(id);
        if (!existingSemester) throw new NotFoundError("Semester not found");
        const number = semesterData.number ?? existingSemester.number;
        const courseId = existingSemester.courseId;
        const duplicate = await SemesterModel.findOne({
            number,
            courseId,
            _id: { $ne: id },
        });
        if (duplicate) throw new ConflictError("Semester already exists");
        delete semesterData.courseId;
        return await SemesterModel.findByIdAndUpdate(
            id,
            semesterData,
            { new: true, runValidators: true }
        );
    }

    getSemestersByCourseId = async (id: string) => {
        const course = await CourseModel.findById(id);
        if (!course) throw new NotFoundError("Course not found");
        return await SemesterModel.find({ courseId: id })
    }

    deleteSemester = async (id: string) => {
        const existingSemester = await SemesterModel.findById(id);
        if (!existingSemester) throw new NotFoundError("Semester not found");
        return await SemesterModel.findByIdAndDelete(id);
    }
}