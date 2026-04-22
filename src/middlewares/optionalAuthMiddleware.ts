import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../core/jwt";
import { userModel } from "../models/user.model";

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token = "";

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await userModel.findById(decoded.userId);
        if (user) {
            (req as any).user = user;
        }
        next();
    } catch (error) {
        // If token is invalid, we still continue as guest
        next();
    }
};
