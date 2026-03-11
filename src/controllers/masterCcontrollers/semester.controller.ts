import { Request, Response } from "express";
import { SemesterService } from "../../services/masterServices/semester.service";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";

export class SemesterController {

  private semesterService: SemesterService;

  constructor() {
    this.semesterService = new SemesterService();
  }

  createSemester = async (req: Request, res: Response) => {

    const semester = await this.semesterService.createSemester(req.body);

    sendResponse(
      res,
      STATUS_CODES.CREATED,
      true,
      "Semester created successfully",
      semester
    );
  };

  getSemesters = async (req: Request, res: Response) => {

    const semesters = await this.semesterService.getSemesters();

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Semesters fetched successfully",
      semesters
    );
  };

  getSemesterById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const semester = await this.semesterService.getSemesterById(id);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Semester fetched successfully",
      semester
    );
  };

  updateSemester = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const semester = await this.semesterService.updateSemester(id, req.body);

    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Semester updated successfully",
      semester
    );
  };

  deleteSemester = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const semester = await this.semesterService.deleteSemester(id);
    sendResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "Semester deleted successfully",
      semester
    );
  };
}