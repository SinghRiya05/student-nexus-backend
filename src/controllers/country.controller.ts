import { Request, Response } from "express";
import { CountryService } from "../services/country.service";
import { STATUS_CODES } from "../config";
import { sendResponse } from "../utils/sendResponse";
const countryService = new CountryService();

export class CountryController {

  create = async (req: Request, res: Response) => {
    const result = await countryService.create(req.body);
    sendResponse(res, STATUS_CODES.CREATED, true, "Country created successfully", result);
  }

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await countryService.update(id, req.body);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Country updated successfully", result);
  }

  getAll = async (req: Request, res: Response) => {
    const result = await countryService.findAll();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Country fetched successfully", result);
  }

  getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await countryService.findById(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Country fetched successfully", result);
  }

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await countryService.deleteById(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Country deleted successfully", result);
  }




}