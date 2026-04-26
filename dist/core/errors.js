"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ConflictError = exports.NotFoundError = exports.AppError = void 0;
const config_1 = require("../config");
const ApiError_1 = require("./ApiError");
class AppError extends ApiError_1.ApiError {
    constructor(message, statusCode) {
        super(message, statusCode);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.RESOURCE_NOT_FOUND) {
        super(message, config_1.STATUS_CODES.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.CONFLICTERROR) {
        super(message, config_1.STATUS_CODES.CONFLICT);
    }
}
exports.ConflictError = ConflictError;
class BadRequestError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.BAD_REQUEST) {
        super(message, config_1.STATUS_CODES.BAD_REQUEST);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.UNAUTHORIZATION) {
        super(message, config_1.STATUS_CODES.UNAUTHORIZED);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.FORBIDDEN) {
        super(message, config_1.STATUS_CODES.FORBIDDEN);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends AppError {
    constructor(message = config_1.COMMON_ERROR_MESSAGE.INTERNALSERVER) {
        super(message, config_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerError = InternalServerError;
