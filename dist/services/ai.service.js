"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = __importDefault(require("../core/env"));
const errors_1 = require("../core/errors");
class AiService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: env_1.default.OPENAI_API_KEY
        });
    }
    async generateAIResponse(messages, model = "gpt-4o-mini") {
        if (!messages) {
            throw new errors_1.BadRequestError("Messages are required");
        }
        const response = await this.openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: "You are Student Nexus helpful assistant"
                },
                ...messages
            ]
        });
        return (response.choices[0]
            ?.message?.content?.trim()
            || "");
    }
}
exports.AiService = AiService;
