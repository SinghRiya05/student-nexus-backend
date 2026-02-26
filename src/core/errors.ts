import { COMMON_ERROR_MESSAGE, STATUS_CODES } from "../config";


export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = COMMON_ERROR_MESSAGE.RESOURCE_NOT_FOUND) {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message = COMMON_ERROR_MESSAGE.BAD_REQUEST) {
    super(message, STATUS_CODES.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = COMMON_ERROR_MESSAGE.UNAUTHORIZATION) {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = COMMON_ERROR_MESSAGE.FORBIDDEN) {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}

export class InternalServerError extends AppError {
  constructor(message = COMMON_ERROR_MESSAGE.INTERNALSERVER) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}