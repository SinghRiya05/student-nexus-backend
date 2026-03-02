import { Response } from "express";

interface ISendResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};