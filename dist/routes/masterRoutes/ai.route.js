"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const ai_controller_1 = require("../../controllers/ai.controller");
const aiController = new ai_controller_1.AiController();
const Airouter = (0, express_1.Router)();
Airouter.post("/generate", authMiddleware_1.middleware, aiController.generateAIResponse);
exports.default = Airouter;
