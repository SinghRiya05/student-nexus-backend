import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCourseSchema, updateCourseSchema, courseIdParamsSchema } from "../../validations/course.validation";
import { CourseController } from "../../controllers/course.controller";

const router = Router();
const courseController = new CourseController();

router.post("/", validateRequest(createCourseSchema), courseController.createCourse);
router.put("/:id", validateRequest(updateCourseSchema), courseController.updateCourse);
router.delete("/:id", validateRequest(courseIdParamsSchema), courseController.deleteCourse);
router.get("/:id", validateRequest(courseIdParamsSchema), courseController.getCourseById);
router.get("/", courseController.getAllCourses);

export default router;