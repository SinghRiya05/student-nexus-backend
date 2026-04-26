"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionController = void 0;
const role_permission_service_1 = require("../services/role-permission.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
class RolePermissionController {
    constructor() {
        this.createOrUpdateRolePermissions = async (req, res) => {
            const { role, permissions } = req.body;
            const result = await this.rolePermissionService.createOrUpdateRolePermissions({ role, permissions });
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Role permissions updated successfully", result);
        };
        this.getPermissionsByRole = async (req, res) => {
            const roleId = req.params.roleId;
            const result = await this.rolePermissionService.getPermissionsByRole(roleId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permissions retrieved successfully", result);
        };
        this.updatePermissionsForRole = async (req, res) => {
            const roleId = req.params.roleId;
            const { permissions } = req.body;
            const result = await this.rolePermissionService.updatePermissionsForRole(roleId, permissions);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permissions updated successfully", result);
        };
        this.deleteRolePermissions = async (req, res) => {
            const roleId = req.params.roleId;
            const result = await this.rolePermissionService.deleteRolePermissions(roleId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Role permissions deleted successfully", result);
        };
        this.addPermissionToRole = async (req, res) => {
            const roleId = req.params.roleId;
            const permissionId = req.params.permissionId;
            const result = await this.rolePermissionService.addPermissionToRole(roleId, permissionId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permission added to role successfully", result);
        };
        this.removePermissionFromRole = async (req, res) => {
            const roleId = req.params.roleId;
            const permissionId = req.params.permissionId;
            const result = await this.rolePermissionService.removePermissionFromRole(roleId, permissionId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permission removed from role successfully", result);
        };
        this.rolePermissionService = new role_permission_service_1.RolePermissionService();
    }
}
exports.RolePermissionController = RolePermissionController;
