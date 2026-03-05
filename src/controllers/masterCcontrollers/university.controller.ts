import { Request, Response } from "express";
import { UniversityService } from "../../services/masterServices/university.service";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";

const universityService= new UniversityService();



export class UniversityController {

   create=async(req:Request,res:Response)=>{
      const result =await universityService.create(req.body);
      sendResponse(res,STATUS_CODES.CREATED,true,"Universities created successfully.",result)
    }
   update=async(req:Request,res:Response)=>{
      const id=req.params.id as string;
      const result =await universityService.update
      (id,req.body);
      sendResponse(res,STATUS_CODES.CREATED,true,"Universities updated successfully.",result)
    }
   getAll=async(req:Request,res:Response)=>{
      const result =await universityService.getAll();
      sendResponse(res,STATUS_CODES.SUCCESS,true,"Universities fetched successfully.",result)
    }
   getById=async(req:Request,res:Response)=>{
      const id=req.params.id as string;
      const result =await universityService.getById(id);
      sendResponse(res,STATUS_CODES.SUCCESS,true,"Universities fetched successfully.",result)
    }
   delete=async(req:Request,res:Response)=>{
      const id=req.params.id as string;
      const result =await universityService.delete(id);
      sendResponse(res,STATUS_CODES.SUCCESS,true,"University deleted successfully.",result)
    }

}