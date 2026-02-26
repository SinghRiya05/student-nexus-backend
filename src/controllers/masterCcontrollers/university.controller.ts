import { Request, Response } from "express";
import { CountryService } from "../../services/masterServices/country.service";
import { sendCreatedResponse, sendErrorResponse, sendSuccessResponse } from "../../core/responses";
import { STATUS_CODES } from "../../config";


const countryService = new CountryService();

export class CountryController {

    async country(req: Request, res: Response) {
        try {
           
            return sendCreatedResponse(res, {}, "Country created successfully. Please check your email for OTP.");
        } catch (error: any) {
            return sendErrorResponse(res, STATUS_CODES.BAD_REQUEST, error.message);
        }
    }

}