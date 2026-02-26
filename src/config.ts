import dotenv from "dotenv";

export enum NODEENV {
  DEV = "dev",
  UAT = "uat",
  PROD = "prod",
}

// Common Error Message
export const COMMON_ERROR_MESSAGE = {
  RESOURCE_NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZATION: "Unauthorization",
  FORBIDDEN: "Forbidden",
  INTERNALSERVER: "InternalServer",
};


// Response status codes used throughout the application
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};



export enum USER_STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = 'INACTIVE',
    BLOCKED = "BLOCKED",
};

export enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = 'INACTIVE'
}


