import { Router } from "express";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";
import { AiController } from "../../controllers/ai.controller";

const aiController = new AiController();

const Airouter = Router();

Airouter.post("/generate", authMiddleware, aiController.generateAIResponse);

export default Airouter;