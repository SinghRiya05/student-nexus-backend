import { courseModel } from "../../models/course.model";
import { ICourse } from "../../interfaces/masterInterfaces/course.interface";
import { BadRequestError, NotFoundError } from "../../core/errors";
import UniversityModel from "../../models/university.model";

export class CourseService {

  async createCourse(data: ICourse) {
    const university = await UniversityModel.findById(data.university);
    if (!university) throw new NotFoundError("University not found");
    const existingCourse = await courseModel.findOne({
      courseName: data.courseName,
      university: data.university,
    });
    if (existingCourse) {
      throw new BadRequestError("Course already exists for this university");
    }
    return await courseModel.create(data);
  }

  async getCourses() {
    return await courseModel
      .find()
      .populate("university")
      .sort({ createdAt: -1 });
  }

  async getCourseById(id: string) {
    const course = await courseModel.findById(id).populate("university");
    if (!course) throw new NotFoundError("Course not found");
    return course;
  }

  async updateCourse(id: string, data: Partial<ICourse>) {
    const course = await courseModel.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("university");
    if (!course) throw new NotFoundError("Course not found");
    return course;
  }

  async deleteCourse(id: string) {
    const course = await courseModel.findByIdAndDelete(id);
    if (!course) throw new NotFoundError("Course not found");
    return course;
  }
}