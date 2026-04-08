import { Router } from "express";
import { AlumniController } from "../../controllers/alumni.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema } from "../../validations/auth.validation";

const alumniRouter = Router();
const alumniController = new AlumniController();

// Public routes
alumniRouter.post("/login", validateRequest(loginSchema), alumniController.login);

// Protected routes
alumniRouter.get("/my-university", authMiddleware, alumniController.getAlumniByMyUniversity);

export default alumniRouter;
