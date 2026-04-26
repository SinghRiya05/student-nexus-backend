"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissionSchema = exports.createPermissionSchema = void 0;
const zod_1 = require("zod");
exports.createPermissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("Name is required as string").min(3, 'Name must be at least 3 characters long'),
        key: zod_1.z.string("Key is required as string").min(3, 'Key must be at least 3 characters long').optional(),
        module: zod_1.z.string("Module is required as string").min(2, 'Module must be at least 2 characters long'),
        description: zod_1.z.string("Description is required as string").optional(),
    }),
});
exports.updatePermissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string("Name is required as string").optional(),
        key: zod_1.z.string("Key is required as string").optional(),
        module: zod_1.z.string("Module is required as string").optional(),
        description: zod_1.z.string("Description is required as string").optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
