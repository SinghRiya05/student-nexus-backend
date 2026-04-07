import { Router } from "express";
import { StudentController } from "../../controllers/students.controller";

const studentRouter = Router();
const studentController = new StudentController();


studentRouter.get("/", studentController.getAllStudents);

export default studentRouter;
