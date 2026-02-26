import { type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { sendErrorsResponse } from "../core/responses";

export const validateRequest =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      sendErrorsResponse(res, 400, error.issues);
    }
  };
