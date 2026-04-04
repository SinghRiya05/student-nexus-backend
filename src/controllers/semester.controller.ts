import { Request, Response } from "express";
import { SemesterService } from "../services/semester.service";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

const semesterService = new SemesterService();

export class SemesterController {
    createSemester = async (req: Request, res: Response) => {
        const result = await semesterService.createSemester(req.body);
        sendResponse(res, STATUS_CODES.CREATED, true, "Semester created successfully", result);
    }

    getAllSemesters = async (req: Request, res: Response) => {
        const result = await semesterService.getAllSemesters();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Semesters fetched successfully", result);
    }

    getSemesterById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await semesterService.getSemesterById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Semester fetched successfully", result);
    }

    updateSemester = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await semesterService.updateSemester(id, req.body);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Semester updated successfully", result);
    }

    deleteSemester = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await semesterService.deleteSemester(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Semester deleted successfully", result);
    }
}