import OpenAI from "openai";
import env from "../core/env";
import { BadRequestError } from "../core/errors";
export class AiService {

    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY
        });
    }

    async generateAIResponse(
        messages: any[],
        model: string = "gpt-4o-mini"
    ) {
        if (!messages) {
            throw new BadRequestError("Messages are required");
        }
        const response = await this.openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content:
                        "You are Student Nexus helpful assistant"
                },

                ...messages
            ]

        });

        return (
            response.choices[0]
                ?.message?.content?.trim()
            || ""
        );

    }

}