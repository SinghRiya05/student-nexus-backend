"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("../services/ai.service");
const sendResponse_1 = require("../utils/sendResponse");
const catchAsync_1 = require("../core/catchAsync");
const aiService = new ai_service_1.AiService();
class AiController {
    constructor() {
        this.generateAIResponse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { messages } = req.body;
            const response = await aiService.generateAIResponse(messages);
            (0, sendResponse_1.sendResponse)(res, 200, true, "AI response", response);
        });
    }
}
exports.AiController = AiController;
