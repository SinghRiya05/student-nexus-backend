import { Router } from "express";
import { StudentController } from "../../controllers/students.controller";

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.get("/me", studentController.getCurrentStudentData);
studentRouter.get("/my-university", studentController.getStudentsByMyUniversity);
studentRouter.get("/matched-hobby", studentController.getStudentsByMatchedHobbyBadge);
studentRouter.get("/", studentController.getAllStudents);

studentRouter.get("/matched-semester-with-course-and-same-university", studentController.getStudentsByMatchedSemesterWithCourseAndSameUniversity);
studentRouter.get("/match-course-and-same-university", studentController.getStudentsByMatchCourseAndSameUniversity);
studentRouter.get("/:id", studentController.getStudentById);
export default studentRouter;
