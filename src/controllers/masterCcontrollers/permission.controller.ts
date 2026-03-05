import { PermissionService } from "../../services/masterServices/permission.service";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";

export class PermissionController {

    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    createPermission = async (req: Request, res: Response) => {
        const permission = await this.permissionService.createPermission(req.body);

        sendResponse(
            res,
            STATUS_CODES.CREATED,
            true,
            "Permission created successfully",
            permission
        );
    };

    getPermissions = async (req: Request, res: Response) => {
        const permissions = await this.permissionService.getPermissions();

        sendResponse(
            res,
            STATUS_CODES.SUCCESS,
            true,
            "Permissions fetched successfully",
            permissions
        );
    };

    getPermissionById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const permission = await this.permissionService.getPermissionById(id);

        sendResponse(
            res,
            STATUS_CODES.SUCCESS,
            true,
            "Permission fetched successfully",
            permission
        );
    };

    updatePermission = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const permission = await this.permissionService.updatePermission(id, req.body);

        sendResponse(
            res,
            STATUS_CODES.SUCCESS,
            true,
            "Permission updated successfully",
            permission
        );
    };

    deletePermission = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const permission = await this.permissionService.deletePermission(id);

        sendResponse(
            res,
            STATUS_CODES.SUCCESS,
            true,
            "Permission deleted successfully",
            permission
        );
    };
}