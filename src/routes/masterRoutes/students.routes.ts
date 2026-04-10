import { Router } from "express";
import { StudentController } from "../../controllers/students.controller";

const studentRouter = Router();
const studentController = new StudentController();


studentRouter.get("/my-university", studentController.getStudentsByMyUniversity);
studentRouter.get("/matched-hobby", studentController.getStudentsByMatchedHobbyBadge);
studentRouter.get("/", studentController.getAllStudents);
studentRouter.get("/matched-semester-with-course-and-same-university", studentController.getStudentsByMatchedSemesterWithCourseAndSameUniversity);

export default studentRouter;
