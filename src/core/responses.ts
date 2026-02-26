import { STATUS_CODES } from "../config";


export const sendSuccessResponse = (res: any, data: any = null, message = 'Request successful') => {
    return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        code: STATUS_CODES.SUCCESS,
        message,
        data,
    });
}

export const sendCreatedResponse = (res: any, data: any = null, message = 'Resource created successfully') => {
    return res.status(STATUS_CODES.CREATED).json({
        success: true,
        code: STATUS_CODES.CREATED,
        message,
        data,
    });
}

export const sendErrorResponse = (res: any, code: number, message: string) => {
    return res.status(code).json({
        success: false,
        code: code,
        message,
    });
}


export const sendErrorsResponse = (res: any, code: number, messages: string[]) => {
    return res.status(code).json({
        success: false,
        code: code,
        errors: messages,
    });
}

