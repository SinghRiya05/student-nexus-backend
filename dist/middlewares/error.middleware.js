"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const responses_1 = require("../core/responses");
const ApiError_1 = require("../core/ApiError");
const config_1 = require("../config");
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        return (0, responses_1.sendErrorResponse)(res, err.statusCode, err.message);
    }
    // ---- Mongoose Validation Error ----
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        return (0, responses_1.sendErrorsResponse)(res, config_1.STATUS_CODES.BAD_REQUEST, messages);
    }
    // ---- Mongoose Duplicate Key Error ----
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return (0, responses_1.sendErrorResponse)(res, config_1.STATUS_CODES.CONFLICT, `${field} already exists`);
    }
    // ---- Mongoose Cast Error (Invalid ID) ----
    if (err.name === "CastError") {
        return (0, responses_1.sendErrorResponse)(res, config_1.STATUS_CODES.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
    }
    console.error(err.stack || err.message);
    return (0, responses_1.sendErrorResponse)(res, config_1.STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
};
exports.errorHandler = errorHandler;
