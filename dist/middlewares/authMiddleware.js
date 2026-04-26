"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jwt_1 = require("../core/jwt");
const ApiError_1 = require("../core/ApiError");
const user_model_1 = require("../models/user.model");
const middleware = async (req, res, next) => {
    let token = "";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        throw new ApiError_1.ApiError("Unauthorized", 401);
    }
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const user = await user_model_1.userModel.findById(decoded.userId);
        if (!user)
            throw new ApiError_1.ApiError("User not found", 404);
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError_1.ApiError("Invalid or expired session", 401);
    }
};
exports.middleware = middleware;
