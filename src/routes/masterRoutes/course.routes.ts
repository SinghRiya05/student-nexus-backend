import { Router } from "express";
import { CourseController } from "../../controllers/masterCcontrollers/course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCourseSchema, deleteCourseSchema, getCourseByIdSchema, updateCourseSchema } from "../../validations/masterValidation/course.validation";

const courseRouter=Router();
const courseController=new CourseController();

courseRouter.post('/', validateRequest(createCourseSchema), courseController.createCourse);

courseRouter.post('/:id', validateRequest(updateCourseSchema), courseController.updateCourse);

courseRouter.get('/', courseController.getCourses);

courseRouter.delete('/:id',validateRequest(deleteCourseSchema), courseController.deleteCourse);

courseRouter.get('/:id', validateRequest(getCourseByIdSchema), courseController.getCourseById);

export default courseRouter;