"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = exports.USER_STATUS = exports.STATUS_CODES = exports.COMMON_ERROR_MESSAGE = exports.NODEENV = void 0;
var NODEENV;
(function (NODEENV) {
    NODEENV["DEV"] = "dev";
    NODEENV["UAT"] = "uat";
    NODEENV["PROD"] = "prod";
})(NODEENV || (exports.NODEENV = NODEENV = {}));
// Common Error Message
exports.COMMON_ERROR_MESSAGE = {
    RESOURCE_NOT_FOUND: "Resource not found",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZATION: "Unauthorization",
    FORBIDDEN: "Forbidden",
    INTERNALSERVER: "InternalServer",
    CONFLICTERROR: "Conflict"
};
// Response status codes used throughout the application
exports.STATUS_CODES = {
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
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["ACTIVE"] = "ACTIVE";
    USER_STATUS["INACTIVE"] = "INACTIVE";
    USER_STATUS["BLOCKED"] = "BLOCKED";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
;
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "ACTIVE";
    STATUS["INACTIVE"] = "INACTIVE";
})(STATUS || (exports.STATUS = STATUS = {}));
