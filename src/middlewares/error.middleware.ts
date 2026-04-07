import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendErrorsResponse } from "../core/responses";
import { ApiError } from "../core/ApiError";
import { STATUS_CODES } from "../config";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  // ---- Mongoose Validation Error ----
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    return sendErrorsResponse(res, STATUS_CODES.BAD_REQUEST, messages);
  }

  // ---- Mongoose Duplicate Key Error ----
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendErrorResponse(res, STATUS_CODES.CONFLICT, `${field} already exists`);
  }

  // ---- Mongoose Cast Error (Invalid ID) ----
  if (err.name === "CastError") {
    return sendErrorResponse(res, STATUS_CODES.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  }

  console.error(err.stack || err.message);
  return sendErrorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
};