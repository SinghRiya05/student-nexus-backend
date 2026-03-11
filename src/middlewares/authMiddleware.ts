import { Request,Response,NextFunction } from "express";
import { verifyAccessToken } from "../core/jwt";
import { ApiError } from "../core/ApiError";
import { userModel } from "../models/user.model";

export const middleware=async(req:Request,res:Response,next:NextFunction)=>{
const authHeader=req.headers.authorization;
if(!authHeader||!authHeader.startsWith("Bearer ")){
    throw new ApiError("Unauthorized",401);
}
const token=authHeader.split(" ")[1];
const decoded= verifyAccessToken(token);
const user=await userModel.findById(decoded.userId);
if(!user) throw new ApiError("User not found",404);
req.user=user;
next();
}