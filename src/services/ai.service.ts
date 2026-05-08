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

        // VALIDATIOn
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

                try {
                    const cachedCourses = await redis.get(cacheKey);
                    if (cachedCourses) {
                        const parsed = JSON.parse(cachedCourses);
                        if (parsed && Array.isArray(parsed)) {
                            console.log("Returning cached courses");
                            return parsed;
                        }
                    }
                } catch (e) {
                    console.log("Redis cache read error (courses):", e);
                }

                console.log("Fetching fresh courses");
                try {
                    const res = await axios.get(`${API_BASE_URL}/course`);
                    const courses = res.data?.data ?? res.data ?? [];
                    console.log("Fetched courses from API");

                    // Try to cache but don't fail if redis is down
                    try {
                        await redis.set(cacheKey, JSON.stringify(courses), "EX", 3600);
                    } catch (redisError) {
                        console.warn("Failed to cache courses in Redis:", redisError);
                    }

                    return courses;
                } catch (apiError: any) {
                    console.error("API Error fetching courses:", apiError.message);
                    throw new Error("Failed to fetch courses from the server.");
                }
            }
        });


        const getUniversitiesTool = tool({
            name: "get_universities",
            description: "Get all available universities for students",
            parameters: z.object({}),
            async execute() {
                const cacheKey = "universities_data_from_api";
                try {
                    const cachedUniversities = await redis.get(cacheKey);
                    if (cachedUniversities) {
                        console.log("Returning cached universities");
                        return JSON.parse(cachedUniversities);
                    }
                } catch (e) {
                    console.log("Redis cache read error (universities):", e);
                }

                console.log("AI decided to call: get_universities");
                try {
                    const res = await axios.get(`${API_BASE_URL}/university`);
                    const universities = res.data?.data ?? res.data ?? [];

                    try {
                        await redis.set(cacheKey, JSON.stringify(universities), "EX", 3600);
                    } catch (redisError) {
                        console.warn("Failed to cache universities in Redis:", redisError);
                    }

                    return universities;
                } catch (apiError: any) {
                    console.error("API Error fetching universities:", apiError.message);
                    throw new Error("Failed to fetch universities from the server.");
                }
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