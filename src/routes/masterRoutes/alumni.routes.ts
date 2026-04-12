import { Router } from "express";
import { AlumniController } from "../../controllers/alumni.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";

const alumniRouter = Router();
const alumniController = new AlumniController();

// Protected routes
alumniRouter.get("/my-university", authMiddleware, alumniController.getAlumniByMyUniversity);
alumniRouter.get("/my-course", authMiddleware, alumniController.getAlumniByMyCourse);
alumniRouter.get("/university/:universityId", authMiddleware, alumniController.getAlumniByUniversity);
alumniRouter.get("/job-titles", authMiddleware, alumniController.getAluminiByJobTitles);
alumniRouter.get("/company", authMiddleware, alumniController.getAluminiByCompany);

export default alumniRouter;
