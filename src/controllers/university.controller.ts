import { UniversityService } from "../services/university.service";
import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

const universityService = new UniversityService();

export class UniversityController {

    createUniversity = async (req: Request, res: Response) => {
        const university = await universityService.createUniversity(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "University created successfully", university);
    }

    getAllUniversities = async (req: Request, res: Response) => {
        const universities = await universityService.getAllUniversities();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Universities fetched successfully", universities);
    }

    getUniversityById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const university = await universityService.getUniversityById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University fetched successfully", university);
    }

    updateUniversity = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const university = await universityService.updateUniversity(id, req.body);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University updated successfully", university);
    }

    deleteUniversity = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const university = await universityService.deleteUniversity(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University deleted successfully", university);
    }

}
