"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = void 0;
const jwt_1 = require("../core/jwt");
const user_model_1 = require("../models/user.model");
const optionalAuthMiddleware = async (req, res, next) => {
    let token = "";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        return next();
    }
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const user = await user_model_1.userModel.findById(decoded.userId);
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // If token is invalid, we still continue as guest
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
