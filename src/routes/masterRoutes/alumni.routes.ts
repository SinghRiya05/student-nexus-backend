import { Router } from "express";
import { AlumniController } from "../../controllers/alumni.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";

const alumniRouter = Router();
const alumniController = new AlumniController();

// Protected routes
alumniRouter.get("/my-university", authMiddleware, alumniController.getAlumniByMyUniversity);

export default alumniRouter;
