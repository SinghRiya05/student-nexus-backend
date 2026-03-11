import { semesterModel } from "../../models/semester.model";
import { ISemester } from "../../interfaces/masterInterfaces/semester.interface";
import { NotFoundError, BadRequestError } from "../../core/errors";
import { Types } from "mongoose";
import { courseModel } from "../../models/course.model";

export class SemesterService {
  async createSemester(data: ISemester) {
    const course = await courseModel.findById(data.courseId);
    if (!course) throw new NotFoundError("Course not found");
    if (data.startYear >= data.endYear) {
      throw new BadRequestError("End year must be greater than start year");
    }
    const existingSemester = await semesterModel.findOne({
      courseId: data.courseId,
      semester: data.semester
    });
    if (existingSemester) {
      throw new BadRequestError("Semester already exists for this course");
    }
    return await semesterModel.create(data);
  }

  async getSemesters() {
    return await semesterModel
      .find()
      .populate("courseId")
      .sort({ createdAt: -1 });
  }

  async getSemesterById(id: string) {
    const semester = await semesterModel
      .findById(id)
      .populate("courseId");

    if (!semester) throw new NotFoundError("Semester not found");

    return semester;
  }

  async updateSemester(id: string, data: Partial<ISemester>) {

    const semester = await semesterModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).populate("courseId");

    if (!semester) throw new NotFoundError("Semester not found");

    return semester;
  }

  async deleteSemester(id: string) {

    const semester = await semesterModel.findByIdAndDelete(id);

    if (!semester) throw new NotFoundError("Semester not found");

    return semester;
  }
}