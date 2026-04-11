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
    
    const alumni = await alumniService.getAluminiByUniversity(user.universityId.toString(), user._id.toString());
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni from your university fetched successfully.", alumni);
  });
}
