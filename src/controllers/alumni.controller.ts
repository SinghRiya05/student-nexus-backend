import { Request, Response } from "express";
import { AlumniService } from "../services/alumni.service";
import { catchAsync } from "../core/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";

const alumniService = new AlumniService();

export class AlumniController {
  
  // --- ALUMNI LOGIN ---
  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";

    const result = await alumniService.alumniLogin(email, password, ip, userAgent);

    // Set Refresh Token in cookie if needed (matching auth controller pattern)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, STATUS_CODES.SUCCESS, true, "Alumni logged in successfully.", {
      user: result.user,
      accessToken: result.accessToken
    });
  });

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
