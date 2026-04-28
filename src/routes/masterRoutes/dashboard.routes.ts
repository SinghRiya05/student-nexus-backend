import { Router } from "express";
import { getDashboardStats } from "../../controllers/dashboard.controller";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);

export default router;
