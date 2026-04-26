"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const permission_model_1 = require("../models/permission.model");
const errors_1 = require("../core/errors");
const crypto_1 = __importDefault(require("crypto"));
class PermissionService {
    generateRandomKey() {
        return `perm_${crypto_1.default.randomBytes(16).toString('hex')}`;
    }
    async createPermission(data) {
        // Generate key if not provided
        if (!data.key) {
            data.key = this.generateRandomKey();
        }
        const permission = await permission_model_1.PermissionModel.findOne({ key: data.key });
        if (permission)
            throw new errors_1.BadRequestError("Permission already exists");
        return await permission_model_1.PermissionModel.create(data);
    }
    async getPermissions() {
        return await permission_model_1.PermissionModel.find().sort({ createdAt: -1 });
    }
    async getPermissionById(id) {
        const permission = await permission_model_1.PermissionModel.findById(id);
        if (!permission)
            throw new errors_1.NotFoundError("Permission not found");
        return permission;
    }
    async updatePermission(id, data) {
        const permission = await permission_model_1.PermissionModel.findByIdAndUpdate(id, data, { new: true });
        if (!permission)
            throw new errors_1.NotFoundError("Permission not found");
        return permission;
    }
    async deletePermission(id) {
        const permission = await permission_model_1.PermissionModel.findByIdAndDelete(id);
        if (!permission)
            throw new errors_1.NotFoundError("Permission not found");
        return permission;
    }
}
exports.PermissionService = PermissionService;
