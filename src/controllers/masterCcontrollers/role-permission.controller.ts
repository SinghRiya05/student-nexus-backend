import { Request, Response } from "express";
import { RolePermissionService } from "../../services/masterServices/role-permission.service";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";

export class RolePermissionController {

  private rolePermissionService: RolePermissionService;

  constructor() {
    this.rolePermissionService = new RolePermissionService();
  }

  createOrUpdateRolePermissions = async (req: Request, res: Response) => {
    const { role, permissions } = req.body;

    const result = await this.rolePermissionService.createOrUpdateRolePermissions({
      role,
      permissions
    });

    sendResponse(
      res,
      STATUS_CODES.CREATED,
      true,
      "Role permissions updated successfully",
      result
    );
  };

  getPermissionsByRole = async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    const result = await this.rolePermissionService.getPermissionsByRole(roleId);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Permissions retrieved successfully",
      result
    );
  };

  updatePermissionsForRole = async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const { permissions } = req.body;

    const result = await this.rolePermissionService.updatePermissionsForRole(
      roleId,
      permissions
    );

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Permissions updated successfully",
      result
    );
  };

  deleteRolePermissions = async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    const result = await this.rolePermissionService.deleteRolePermissions(roleId);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Role permissions deleted successfully",
      result
    );
  };

  addPermissionToRole = async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const permissionId = req.params.permissionId as string;

    const result = await this.rolePermissionService.addPermissionToRole(
      roleId,
      permissionId
    );

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Permission added to role successfully",
      result
    );
  };

  removePermissionFromRole = async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const permissionId = req.params.permissionId as string;

    const result = await this.rolePermissionService.removePermissionFromRole(
      roleId,
      permissionId
    );

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Permission removed from role successfully",
      result
    );
  };
}