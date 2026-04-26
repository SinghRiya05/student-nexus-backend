"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const role_service_1 = require("../services/role.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const roleService = new role_service_1.RoleService();
class RoleController {
    constructor() {
        this.create = async (req, res) => {
            const result = await roleService.create(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Role created successfully.", result);
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            const result = await roleService.update(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Role updated successfully.", result);
        };
        this.getAll = async (req, res) => {
            const result = await roleService.getAll();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Roles fetched successfully.", result);
        };
        this.getById = async (req, res) => {
            const id = req.params.id;
            const result = await roleService.getById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Role fetched successfully.", result);
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            const result = await roleService.delete(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Role deleted successfully.", result);
        };
        this.assignRole = async (req, res) => {
            const id = req.params.id;
            const result = await roleService.assignRole(id, req.body.roleId);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Role assigned successfully.", result);
        };
    }
}
exports.RoleController = RoleController;
