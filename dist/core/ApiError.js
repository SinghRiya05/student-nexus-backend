"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
// this is api err
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
