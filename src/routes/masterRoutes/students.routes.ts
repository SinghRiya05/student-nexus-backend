import { Router } from "express";
import { StudentController } from "../../controllers/students.controller";

const studentRouter = Router();
const studentController = new StudentController();


studentRouter.get("/my-university", studentController.getStudentsByMyUniversity);
studentRouter.get("/my-university/alumini", studentController.getAluminiByMyUniversity);
studentRouter.get("/", studentController.getAllStudents);

export default studentRouter;
