"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorsResponse = exports.sendErrorResponse = exports.sendCreatedResponse = exports.sendSuccessResponse = void 0;
const config_1 = require("../config");
const sendSuccessResponse = (res, data = null, message = 'Request successful') => {
    return res.status(config_1.STATUS_CODES.SUCCESS).json({
        success: true,
        code: config_1.STATUS_CODES.SUCCESS,
        message,
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendCreatedResponse = (res, data = null, message = 'Resource created successfully') => {
    return res.status(config_1.STATUS_CODES.CREATED).json({
        success: true,
        code: config_1.STATUS_CODES.CREATED,
        message,
        data,
    });
};
exports.sendCreatedResponse = sendCreatedResponse;
const sendErrorResponse = (res, code, message) => {
    return res.status(code).json({
        success: false,
        code: code,
        message,
    });
};
exports.sendErrorResponse = sendErrorResponse;
const sendErrorsResponse = (res, code, messages) => {
    return res.status(code).json({
        success: false,
        code: code,
        errors: messages,
    });
};
exports.sendErrorsResponse = sendErrorsResponse;
