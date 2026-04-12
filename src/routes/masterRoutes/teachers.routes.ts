import { Router } from "express";
import { TeacherController } from "../../controllers/teachers.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";
import { uploadFileTo } from "../../middlewares/fileUpload.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTeacherResourceValidation, updateTeacherResourceValidation } from "../../validations/teacher-resource.validation";

const teacherRouter = Router();
const teacherController = new TeacherController();

// GET /teachers/same-university
teacherRouter.get("/same-university", authMiddleware, teacherController.getSameUniversityTeachers);

// GET /teachers/class-teachers
teacherRouter.get("/class-teachers", authMiddleware, teacherController.getClassTeachers);

// GET /teachers/other-universities
teacherRouter.get("/other-universities", authMiddleware, teacherController.getOtherUniversityTeachers);

// GET /teachers/by-course/:courseId
teacherRouter.get("/by-course/:courseId", authMiddleware, teacherController.getTeachersByCourse);


// --- TEACHER RESOURCE CRUD ---
teacherRouter.get("/resources", authMiddleware, teacherController.getTeacherResources);
teacherRouter.get("/resources/teacher/:teacherId", authMiddleware, teacherController.getTeacherResources);
teacherRouter.get("/resources/detail/:resourceId", authMiddleware, teacherController.getResourceById);

teacherRouter.post(
  "/resources",
  authMiddleware,
  uploadFileTo("teachers/resources").single("fileUrl"),
  (req, res, next) => {
    if (req.file) {
      req.body.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }
    next();
  },
  validateRequest(createTeacherResourceValidation),
  teacherController.createResource
);


teacherRouter.put(
  "/resources/:resourceId",
  authMiddleware,
  uploadFileTo("teachers/resources").single("fileUrl"),
  (req, res, next) => {
    if (req.file) {
      req.body.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }
    next();
  },
  validateRequest(updateTeacherResourceValidation),
  teacherController.updateResource
);

teacherRouter.delete("/resources/:resourceId", authMiddleware, teacherController.deleteResource);
teacherRouter.get("/student-resources", authMiddleware, teacherController.getResourcesForStudents);

export default teacherRouter;
