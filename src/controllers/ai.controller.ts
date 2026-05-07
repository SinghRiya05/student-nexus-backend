import { AiService } from "../services/ai.service";
import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../core/catchAsync";

const aiService = new AiService();


export class AiController {
    generateAIResponse = catchAsync(async (req: Request, res: Response) => {

        const { messages } = req.body;
        const token = req.headers.authorization as string;
        const response = await aiService.generateAIResponse(messages, token);
        sendResponse(res, 200, true, "AI response", response);

    });
}