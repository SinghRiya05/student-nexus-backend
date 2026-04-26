"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionModel = void 0;
const mongoose_1 = require("mongoose");
const rolePermissionSchema = new mongoose_1.Schema({
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
    permissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });
exports.RolePermissionModel = (0, mongoose_1.model)("RolePermission", rolePermissionSchema);
