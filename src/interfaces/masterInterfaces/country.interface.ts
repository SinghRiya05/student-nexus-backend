import { Types } from "mongoose";
import { STATUS } from "../../config";


export interface ICountry {
    name: string;
    image: string;
    code: string;
    currency: string;
    status: STATUS;
}
