"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teachers_controller_1 = require("../../controllers/teachers.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const fileUpload_middleware_1 = require("../../middlewares/fileUpload.middleware");
const validateRequest_1 = require("../../middlewares/validateRequest");
const teacher_resource_validation_1 = require("../../validations/teacher-resource.validation");
const teacherRouter = (0, express_1.Router)();
const teacherController = new teachers_controller_1.TeacherController();
// GET /teachers/same-university
teacherRouter.get("/same-university", authMiddleware_1.middleware, teacherController.getSameUniversityTeachers);
// GET /teachers/class-teachers
teacherRouter.get("/class-teachers", authMiddleware_1.middleware, teacherController.getClassTeachers);
// GET /teachers/other-universities
teacherRouter.get("/other-universities", authMiddleware_1.middleware, teacherController.getOtherUniversityTeachers);
// GET /teachers/:id
teacherRouter.get("/:id", authMiddleware_1.middleware, teacherController.getTeacherById);
// GET /teachers/by-course/:courseId
teacherRouter.get("/by-course/:courseId", authMiddleware_1.middleware, teacherController.getTeachersByCourse);
// --- TEACHER RESOURCE CRUD ---
teacherRouter.get("/resources", authMiddleware_1.middleware, teacherController.getTeacherResources);
teacherRouter.get("/resources/teacher/:teacherId", authMiddleware_1.middleware, teacherController.getTeacherResources);
teacherRouter.get("/resources/detail/:resourceId", authMiddleware_1.middleware, teacherController.getResourceById);
teacherRouter.post("/resources", authMiddleware_1.middleware, (0, fileUpload_middleware_1.uploadFileTo)("teachers/resources").single("fileUrl"), (req, res, next) => {
    if (req.file) {
        req.body.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }
    next();
}, (0, validateRequest_1.validateRequest)(teacher_resource_validation_1.createTeacherResourceValidation), teacherController.createResource);
teacherRouter.put("/resources/:resourceId", authMiddleware_1.middleware, (0, fileUpload_middleware_1.uploadFileTo)("teachers/resources").single("fileUrl"), (req, res, next) => {
    if (req.file) {
        req.body.fileUrl = `/uploads/teachers/resources/${req.file.filename}`;
    }
    next();
}, (0, validateRequest_1.validateRequest)(teacher_resource_validation_1.updateTeacherResourceValidation), teacherController.updateResource);
teacherRouter.delete("/resources/:resourceId", authMiddleware_1.middleware, teacherController.deleteResource);
teacherRouter.get("/student-resources", authMiddleware_1.middleware, teacherController.getResourcesForStudents);
exports.default = teacherRouter;
