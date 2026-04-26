"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const permission_service_1 = require("../services/permission.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
class PermissionController {
    constructor() {
        this.createPermission = async (req, res) => {
            const permission = await this.permissionService.createPermission(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Permission created successfully", permission);
        };
        this.getPermissions = async (req, res) => {
            const permissions = await this.permissionService.getPermissions();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permissions fetched successfully", permissions);
        };
        this.getPermissionById = async (req, res) => {
            const id = req.params.id;
            const permission = await this.permissionService.getPermissionById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permission fetched successfully", permission);
        };
        this.updatePermission = async (req, res) => {
            const id = req.params.id;
            const permission = await this.permissionService.updatePermission(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permission updated successfully", permission);
        };
        this.deletePermission = async (req, res) => {
            const id = req.params.id;
            const permission = await this.permissionService.deletePermission(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Permission deleted successfully", permission);
        };
        this.permissionService = new permission_service_1.PermissionService();
    }
}
exports.PermissionController = PermissionController;
