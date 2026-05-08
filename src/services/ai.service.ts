import OpenAI from "openai";
import { Agent, run, tool } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import { z } from "zod";
import axios from "axios";
import env from "../core/env";
import { redis } from "../core/redis";
import { BadRequestError } from "../core/errors";


export class AiService {


    async generateAIResponse(
        messages: any[],
        token: string,
        model: string = "gpt-4o-mini"
    ) {

        // VALIDATION
        if (!messages || !Array.isArray(messages)) {
            throw new BadRequestError("Messages are required");
        }

        const API_BASE_URL = env.NODE_ENV === "dev"
            ? `http://localhost:${env.PORT}/api/v1`
            : "https://api.factglint.com/api/v1";

        // =========================
        // TOOL
        // =========================

        const getCoursesTool = tool({
            name: "get_courses",

            description: "Get all available courses for students",

            parameters: z.object({}),

            async execute() {
                const cacheKey = "courses_data_from_api";
                const cachedCourses = await redis.get(cacheKey);
                if (cachedCourses) {
                    console.log("Returning cached courses");
                    return JSON.parse(cachedCourses);
                }
                console.log("AI decided to call: get_courses");
                const res = await axios.get(`${API_BASE_URL}/course`);
                await redis.set(cacheKey, JSON.stringify(res.data.data), "EX", 3600);
                return res.data.data;
            }
        });

        const getUniversitiesTool = tool({
            name: "get_universities",
            description: "Get all available universities for students",
            parameters: z.object({}),
            async execute() {
                const cacheKey = "universities_data_from_api";
                const cachedUniversities = await redis.get(cacheKey);
                if (cachedUniversities) {
                    console.log("Returning cached universities");
                    return JSON.parse(cachedUniversities);
                }

                console.log("AI decided to call: get_universities");
                const res = await axios.get(`${API_BASE_URL}/university`);
                await redis.set(cacheKey, JSON.stringify(res.data.data), "EX", 3600);
                return res.data.data;
            }
        });

        const getFollowersTool = tool({
            name: "get_followers",
            description:
                "Get logged in user's followers",
            parameters: z.object({}),
            async execute() {
                console.log(
                    "AI decided to call: get_followers"
                );
                const response = await axios.get(
                    `${API_BASE_URL}/follow/followers/ai`,
                    {
                        headers: {
                            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
                        }
                    }
                );
                return response.data;
            }
        });

        const getFollowingTool = tool({
            name: "get_following",
            description:
                "Get logged in user's following",
            parameters: z.object({}),
            async execute() {
                console.log("AI decided to call: get_following");
                const response = await axios.get(
                    `${API_BASE_URL}/follow/following/ai`,
                    {
                        headers: {
                            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
                        }
                    }
                );

                return response.data;
            }
        });




        // =========================
        // AGENTr
        // =========================

        const agent = new Agent({
            name: "Student Nexus Assistant",

            instructions: `
                You are Student Nexus helpful AI assistant.
                Your job is to help students.

                Kepp Responses short until user ask for details.

                You can:
                - suggest courses
                - answer coding questions
                - help in career guidance
                - help with internships

                If user asks about courses,
                use the get_courses tool.
                If user asks about universities,
                use the get_universities tool.
                If user asks about followers,
                use the get_followers tool.
                If user asks about following,
                use the get_following tool.


            `,

            model,

            tools: [getCoursesTool, getUniversitiesTool, getFollowersTool, getFollowingTool]
        });

        // =========================
        // FORMAT MESSAGES
        // =========================
        const formattedMessages: AgentInputItem[] = messages.map((msg) => {

            // SYSTEM
            if (msg.role === "system") {
                return {
                    role: "system",
                    content: msg.content
                };
            }

            // USER
            if (msg.role === "user") {
                return {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: msg.content
                        }
                    ]
                };
            }

            // ASSISTANT
            return {
                role: "assistant",
                status: "completed",
                content: [
                    {
                        type: "output_text",
                        text: msg.content
                    }
                ]
            };
        });
        console.log("Messages Sent To AI:");
        console.log(formattedMessages);

        // =========================
        // RUN AGENT
        // =========================

        const result = await run(
            agent,
            formattedMessages
        );

        console.log("Final AI Response:");
        console.log(result.finalOutput);

        // =========================
        // RETURN RESPONSE
        // =========================

        return result.finalOutput || "";
    }
}