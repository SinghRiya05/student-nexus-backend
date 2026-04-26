"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRolePermissionSchema = exports.createRolePermissionSchema = void 0;
const zod_1 = require("zod");
exports.createRolePermissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.string().min(1, "Role ID is required"),
        permissions: zod_1.z.array(zod_1.z.string()).min(1, "At least one permission is required"),
    }),
});
exports.updateRolePermissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        permissions: zod_1.z.array(zod_1.z.string()).min(1, "At least one permission is required"),
    }),
    params: zod_1.z.object({
        roleId: zod_1.z.string().min(1, "Role ID is required"),
    }),
});
