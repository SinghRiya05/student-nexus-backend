import { StateService } from "../services/state.service";
import { Request, Response } from "express";
import { STATUS_CODES } from "../config";
import { sendResponse } from "../utils/sendResponse";

const stateService = new StateService();

export class StateController {
    create = async (req: Request, res: Response) => {
        const result = await stateService.create(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "State created successfully", result);
    }
    update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await stateService.update(id, req.body);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "State updated successfully", result);
    }
    getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await stateService.findById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "State fetched successfully", result);
    }
    getAll = async (req: Request, res: Response) => {
        const result = await stateService.findAll();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "States fetched successfully", result);
    }
    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await stateService.deleteById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "State deleted successfully", result);
    }
}

