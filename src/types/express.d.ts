import { IUser } from "../interfaces/masterInterfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
