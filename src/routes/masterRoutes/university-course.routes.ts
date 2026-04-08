import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { assignCourseSchema, syncUniversityCoursesSchema, universityCourseIdParamsSchema } from "../../validations/university-course.validation";
import { UniversityCourseController } from "../../controllers/university-course.controller";

const router = Router();
const universityCourseController = new UniversityCourseController();

router.post("/", validateRequest(assignCourseSchema), universityCourseController.assignCourse);
router.delete("/", universityCourseController.removeCourse);
router.get("/university/:id", validateRequest(universityCourseIdParamsSchema), universityCourseController.getCoursesByUniversity);
router.get("/course/:id", validateRequest(universityCourseIdParamsSchema), universityCourseController.getUniversitiesByCourse);
router.post("/sync", validateRequest(syncUniversityCoursesSchema), universityCourseController.syncUniversityCourses);
router.post("/bulk-remove", validateRequest(assignCourseSchema), universityCourseController.bulkRemoveCourses);

export default router;