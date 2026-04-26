"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const role_permission_controller_1 = require("../../controllers/role-permission.controller");
const role_permission_validation_1 = require("../../validations/role-permission.validation");
const rolePermissionRouter = (0, express_1.Router)();
const rolePermissionController = new role_permission_controller_1.RolePermissionController();
// create or update role permissions
rolePermissionRouter.post("/", (0, validateRequest_1.validateRequest)(role_permission_validation_1.createRolePermissionSchema), rolePermissionController.createOrUpdateRolePermissions);
// get permissions by role
rolePermissionRouter.get("/:roleId", rolePermissionController.getPermissionsByRole);
// update permissions for role
rolePermissionRouter.put("/:roleId", rolePermissionController.updatePermissionsForRole);
// delete all permissions for role
rolePermissionRouter.delete("/:roleId", rolePermissionController.deleteRolePermissions);
// add permission to role
rolePermissionRouter.post("/:roleId/:permissionId", rolePermissionController.addPermissionToRole);
// remove permission from role
rolePermissionRouter.delete("/:roleId/:permissionId", rolePermissionController.removePermissionFromRole);
exports.default = rolePermissionRouter;
