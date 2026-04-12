import { Request, Response } from "express";
import { AlumniService } from "../services/alumni.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

const alumniService = new AlumniService();

export class AlumniController {
  
  // --- GET ALUMNI FROM MY UNIVERSITY ---
  getAlumniByMyUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }
    
    const alumni = await alumniService.getAluminiByMyUniversity(user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your university fetched successfully.", alumni);
  });


  // --- GET ALUMNI FROM MY COURSE ---
  getAlumniByMyCourse = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.courseIds) {
      throw new Error("User's course association not found.");
    }
    
    const alumni = await alumniService.getAluminiByMyCourse(user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your course fetched successfully.", alumni);
  });


  // --- GET ALUMNI BY UNIVERSITY ---
  getAlumniByUniversity = catchAsync(async (req: Request, res: Response) => {
    const { universityId } = req.params;
    const user = (req as any).user;
    
    const alumni = await alumniService.getAluminiByUniversity(universityId as string, user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your university fetched successfully.", alumni);
  });


  // --- GET ALUMNI BY JOB TITLES ---
  getAluminiByJobTitles = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }
    
    const alumni = await alumniService.getAluminiByJobTitles(user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your job titles fetched successfully.", alumni);
  });



  // --- GET ALUMNI BY COMPANY ---
  getAluminiByCompany = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user || !user.universityId) {
      throw new Error("User's university association not found.");
    }
    
    const alumni = await alumniService.getAluminiByCompany(user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your company fetched successfully.", alumni);
  });
}
