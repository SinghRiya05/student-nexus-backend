"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alumni_controller_1 = require("../../controllers/alumni.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const alumniRouter = (0, express_1.Router)();
const alumniController = new alumni_controller_1.AlumniController();
// Protected routes
alumniRouter.get("/my-university", authMiddleware_1.middleware, alumniController.getAlumniByMyUniversity);
alumniRouter.get("/my-course", authMiddleware_1.middleware, alumniController.getAlumniByMyCourse);
alumniRouter.get("/university/:universityId", authMiddleware_1.middleware, alumniController.getAlumniByUniversity);
alumniRouter.get("/job-titles", authMiddleware_1.middleware, alumniController.getAluminiByJobTitles);
alumniRouter.get("/company", authMiddleware_1.middleware, alumniController.getAluminiByCompany);
alumniRouter.get("/:id", authMiddleware_1.middleware, alumniController.getAlumniById);
exports.default = alumniRouter;
