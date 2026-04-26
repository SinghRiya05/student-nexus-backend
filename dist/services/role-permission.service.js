"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const mongoose_1 = require("mongoose");
const role_permission_model_1 = require("../models/role-permission.model");
const role_model_1 = __importDefault(require("../models/role.model"));
const permission_model_1 = require("../models/permission.model");
const errors_1 = require("../core/errors");
class RolePermissionService {
    async createOrUpdateRolePermissions(data) {
        const { role, permissions } = data;
        if (!mongoose_1.Types.ObjectId.isValid(role))
            throw new errors_1.BadRequestError("Invalid Role Id");
        const roleExists = await role_model_1.default.findById(role);
        if (!roleExists)
            throw new errors_1.NotFoundError("Role not found");
        const permissionIds = permissions.map(p => new mongoose_1.Types.ObjectId(p));
        const existingPermissions = await permission_model_1.PermissionModel.find({
            _id: { $in: permissionIds }
        });
        if (existingPermissions.length !== permissions.length)
            throw new errors_1.BadRequestError("One or more permissions are invalid");
        return await role_permission_model_1.RolePermissionModel.findOneAndUpdate({ role: new mongoose_1.Types.ObjectId(role) }, { permissions: permissionIds }, { upsert: true, new: true }).populate("role").populate("permissions");
    }
    async getPermissionsByRole(roleId) {
        if (!mongoose_1.Types.ObjectId.isValid(roleId))
            throw new errors_1.BadRequestError("Invalid Role Id");
        const role = await role_model_1.default.findById(roleId);
        if (!role)
            throw new errors_1.NotFoundError("Role not found");
        const rolePermission = await role_permission_model_1.RolePermissionModel
            .findOne({ role: new mongoose_1.Types.ObjectId(roleId) })
            .populate("permissions");
        if (!rolePermission)
            throw new errors_1.NotFoundError("Permissions not assigned to this role");
        return rolePermission;
    }
    async updatePermissionsForRole(roleId, permissions) {
        if (!mongoose_1.Types.ObjectId.isValid(roleId))
            throw new errors_1.BadRequestError("Invalid Role Id");
        const role = await role_model_1.default.findById(roleId);
        if (!role)
            throw new errors_1.NotFoundError("Role not found");
        const permissionIds = permissions.map(p => new mongoose_1.Types.ObjectId(p));
        const existingPermissions = await permission_model_1.PermissionModel.find({
            _id: { $in: permissionIds }
        });
        if (existingPermissions.length !== permissions.length)
            throw new errors_1.BadRequestError("Invalid permission ids");
        return await role_permission_model_1.RolePermissionModel.findOneAndUpdate({ role: new mongoose_1.Types.ObjectId(roleId) }, { permissions: permissionIds }, { new: true }).populate("role").populate("permissions");
    }
    async deleteRolePermissions(roleId) {
        if (!mongoose_1.Types.ObjectId.isValid(roleId))
            throw new errors_1.BadRequestError("Invalid Role Id");
        const role = await role_model_1.default.findById(roleId);
        if (!role)
            throw new errors_1.NotFoundError("Role not found");
        const deleted = await role_permission_model_1.RolePermissionModel.findOneAndDelete({
            role: new mongoose_1.Types.ObjectId(roleId)
        });
        if (!deleted)
            throw new errors_1.NotFoundError("Role permissions not found");
        return deleted;
    }
    async addPermissionToRole(roleId, permissionId) {
        if (!mongoose_1.Types.ObjectId.isValid(roleId) || !mongoose_1.Types.ObjectId.isValid(permissionId))
            throw new errors_1.BadRequestError("Invalid Id");
        const role = await role_model_1.default.findById(roleId);
        if (!role)
            throw new errors_1.NotFoundError("Role not found");
        const permission = await permission_model_1.PermissionModel.findById(permissionId);
        if (!permission)
            throw new errors_1.NotFoundError("Permission not found");
        return await role_permission_model_1.RolePermissionModel.findOneAndUpdate({ role: new mongoose_1.Types.ObjectId(roleId) }, { $addToSet: { permissions: new mongoose_1.Types.ObjectId(permissionId) } }, { upsert: true, new: true }).populate("role").populate("permissions");
    }
    async removePermissionFromRole(roleId, permissionId) {
        if (!mongoose_1.Types.ObjectId.isValid(roleId) || !mongoose_1.Types.ObjectId.isValid(permissionId)) {
            throw new errors_1.BadRequestError("Invalid Id");
        }
        const role = await role_model_1.default.findById(roleId);
        if (!role)
            throw new errors_1.NotFoundError("Role not found");
        const permission = await permission_model_1.PermissionModel.findById(permissionId);
        if (!permission)
            throw new errors_1.NotFoundError("Permission not found");
        return await role_permission_model_1.RolePermissionModel.findOneAndUpdate({ role: new mongoose_1.Types.ObjectId(roleId) }, { $pull: { permissions: new mongoose_1.Types.ObjectId(permissionId) } }, { new: true }).populate("role").populate("permissions");
    }
}
exports.RolePermissionService = RolePermissionService;
