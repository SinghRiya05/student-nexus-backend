"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleSchema = exports.updateRoleSchema = exports.getRoleSchema = exports.createRoleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const config_1 = require("../config");
exports.createRoleSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string("Name should be a string")
            .min(2, "Role name must be at least 2 characters long"),
        description: zod_1.default
            .string("Description should be a string")
            .optional(),
        status: zod_1.default.enum([config_1.STATUS.ACTIVE, config_1.STATUS.INACTIVE], "Status must be either 'ACTIVE' or 'INACTIVE'").optional(),
    }),
});
exports.getRoleSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string("Role id should be a string"),
    }),
});
exports.updateRoleSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string("Role id should be a string"),
    }),
    body: zod_1.default.object({
        name: zod_1.default
            .string("Name should be a string")
            .min(2, "Role name must be at least 2 characters long")
            .optional(),
        description: zod_1.default
            .string("Description should be a string")
            .optional(),
        status: zod_1.default
            .enum([config_1.STATUS.ACTIVE, config_1.STATUS.INACTIVE], "Status must be either 'ACTIVE' or 'INACTIVE'")
            .optional(),
    }),
});
exports.deleteRoleSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string("Role id should be a string"),
    }),
});
