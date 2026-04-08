import { Request,Response,NextFunction } from "express";
import { verifyAccessToken } from "../core/jwt";
import { ApiError } from "../core/ApiError";
import { userModel } from "../models/user.model";

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    let token = "";

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        throw new ApiError("Unauthorized", 401);
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await userModel.findById(decoded.userId);
        if (!user) throw new ApiError("User not found", 404);
        (req as any).user = user;
        next();
    } catch (error) {
        throw new ApiError("Invalid or expired session", 401);
    }
};