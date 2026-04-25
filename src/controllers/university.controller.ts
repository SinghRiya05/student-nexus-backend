import { UniversityService } from "../services/university.service";
import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { STATUS_CODES } from "../config";
import { catchAsync } from "../core/catchAsync";
import uploadImageToCloudinary from "../utils/cloudinaryUpload";

const universityService = new UniversityService();

export class UniversityController {

    createUniversity = catchAsync(async (req: Request, res: Response) => {
        const files = req.files as {
            image?: Express.Multer.File[];
            logo?: Express.Multer.File[];
        };
        let image = "";
        let logo = "";
        if (files?.image?.[0]) {
            const uploadedImage = await uploadImageToCloudinary(files.image[0]);
            image = uploadedImage.url;
        }
        if (files?.logo?.[0]) {
            const uploadedLogo = await uploadImageToCloudinary(files.logo[0]);
            logo = uploadedLogo.url;
        }
        const university = await universityService.createUniversity({ ...req.body, image, logo });
        sendResponse(res, STATUS_CODES.CREATED, true, "University created successfully", university);
    });

    getAllUniversities = catchAsync(async (req: Request, res: Response) => {
        const universities = await universityService.getAllUniversities();
        sendResponse(res, STATUS_CODES.SUCCESS, true, "Universities fetched successfully", universities);
    });

    getUniversityById = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const university = await universityService.getUniversityById(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University fetched successfully", university);
    });

    updateUniversity = catchAsync(async (req: Request, res: Response) => {
        const files = req.files as {
            image?: Express.Multer.File[];
            logo?: Express.Multer.File[];
        };
        
        const updateData: any = { ...req.body };
        
        if (files?.image?.[0]) {
            const uploadedImage = await uploadImageToCloudinary(files.image[0]);
            updateData.image = uploadedImage.url;
        }
        if (files?.logo?.[0]) {
            const uploadedLogo = await uploadImageToCloudinary(files.logo[0]);
            updateData.logo = uploadedLogo.url;
        }

        const id = req.params.id as string;
        const university = await universityService.updateUniversity(id, updateData);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University updated successfully", university);
    });

    deleteUniversity = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const university = await universityService.deleteUniversity(id);
        sendResponse(res, STATUS_CODES.SUCCESS, true, "University deleted successfully", university);
    });

}
