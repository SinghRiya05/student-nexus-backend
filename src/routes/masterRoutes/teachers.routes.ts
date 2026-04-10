import { Router } from "express";
import { TeacherController } from "../../controllers/teachers.controller";

const teacherRouter = Router();
const teacherController = new TeacherController();

// GET /teachers/same-university
teacherRouter.get("/same-university", teacherController.getSameUniversityTeachers);

// GET /teachers/class-teachers
teacherRouter.get("/class-teachers", teacherController.getClassTeachers);

// GET /teachers/other-universities
teacherRouter.get("/other-universities", teacherController.getOtherUniversityTeachers);

// GET /teachers/by-course/:courseId
teacherRouter.get("/by-course/:courseId", teacherController.getTeachersByCourse);

export default teacherRouter;
