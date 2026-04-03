import { CityService } from "../services/city.service";
import { Request, Response } from "express";
import { STATUS_CODES } from "../config";
import { sendResponse } from "../utils/sendResponse";

const cityService = new CityService();

export class CityController {
    create = async (req: Request, res: Response) => {
        const result = await cityService.create(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "City created successfully", result);
    }
    update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await cityService.update(id, req.body);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "City updated successfully", result);
    }
    getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await cityService.findById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "City fetched successfully", result);
    }
    getAll = async (req: Request, res: Response) => {
        const result = await cityService.findAll();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Cities fetched successfully", result);
    }
    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await cityService.deleteById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "City deleted successfully", result);
    }
}