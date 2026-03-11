import { UserService } from "../../services/masterServices/user.service";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { STATUS_CODES } from "../../config";
import { clearRefreshTokenCookie, sendRefreshTokenCookie } from "../../core/cookies";
import { ApiError } from "../../core/ApiError";
import { signAccessToken, verifyRefreshToken } from "../../core/jwt";
import { sendSuccessResponse } from "../../core/responses";

const userService=new UserService();

export class UserController{
  
    createUser=async(req:Request,res:Response)=>{
       const result=await userService.createUser(req.body);
       sendRefreshTokenCookie(res,result.refreshToken);
       sendResponse(res,STATUS_CODES.CREATED,true,"User registered successfully",{user:result.user,accessToken:result.accessToken})
    }
  
    updateUser=async(req:Request,res:Response)=>{
       const id=req.params.id as string;
       const result=await userService.updateUser(id,req.body);
       sendResponse(res,STATUS_CODES.CREATED,true,"User Updated successfully",result)
    }

    loginUser=async(req:Request,res:Response)=>{
       const result=await userService.login(req.body);
       sendRefreshTokenCookie(res,result.refreshToken);
       sendResponse(res,STATUS_CODES.CREATED,true,"User LoggedIn successfully",{user:result.user,accessToken:result.accessToken})
    }

    logoutUser=async(req:Request,res:Response)=>{
        clearRefreshTokenCookie(res);
        sendResponse(res,STATUS_CODES.SUCCESS,true,"Logout Successfull")
    }

    refreshToken = async(req:Request,res:Response) => {
        const token = req.cookies.refreshToken;
        if (!token)throw new ApiError("Refresh token missing",401);
        const payload = verifyRefreshToken(token);
        const accessToken = signAccessToken({
        userId: payload.userId
        });
        sendSuccessResponse(res,accessToken,"Token Refreshed");
    };

    getUsers=async(req:Request,res:Response)=>{
        const users=await userService.getUsers();
        sendResponse(res,STATUS_CODES.SUCCESS,true,"users fetehed successfully",users);
    }

    getUserById=async(req:Request,res:Response)=>{
        const id =req.params.id as string;
        const users=await userService.getUserById(id);
        sendResponse(res,STATUS_CODES.SUCCESS,true,"users fetehed successfully",users);
    }

    softDeleteUser=async(req:Request,res:Response)=>{
        const id =req.params.id as string;
        const result=await userService.softDeleteUser(id);
        sendResponse(res,STATUS_CODES.SUCCESS,true,"users deleted successfully",result);
    }

    deleteUser=async(req:Request,res:Response)=>{
        const id =req.params.id as string;
        const result=await userService.deleteUser(id);
        sendResponse(res,STATUS_CODES.SUCCESS,true,"users deleted successfully",result);
    }

    toggleUserStatus=async(req:Request,res:Response)=>{
        const id =req.params.id as string;
        const users=await userService.toggleUserStatus(id);
        sendResponse(res,STATUS_CODES.SUCCESS,true,"Status updated successfully",users);
    }

    
}