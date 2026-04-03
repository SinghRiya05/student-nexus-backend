import { RoleService } from "../services/role.service";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import { Request, Response } from "express";

const roleService = new RoleService();

export class RoleController {
  create = async (req: Request, res: Response) => {
    const result = await roleService.create(req.body);
    sendResponse(res, STATUS_CODES.CREATED, true, "Role created successfully.", result)
  }
  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await roleService.update(id, req.body);
    sendResponse(res, STATUS_CODES.CREATED, true, "Role updated successfully.", result)
  }
  getAll = async (req: Request, res: Response) => {
    const result = await roleService.getAll();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Roles fetched successfully.", result)
  }
  getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await roleService.getById(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Role fetched successfully.", result)
  }
  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await roleService.delete(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Role deleted successfully.", result)
  }
}