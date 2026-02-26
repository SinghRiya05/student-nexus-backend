import { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "../core/responses";
import { ApiError } from "../core/ApiError";
import { STATUS_CODES } from "../config";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }
  console.error(err.message);
  return sendErrorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
};