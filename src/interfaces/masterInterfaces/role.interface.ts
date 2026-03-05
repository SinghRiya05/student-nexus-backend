import { STATUS } from "../../config";

export interface IRole {
  name: string;
  description?: string;
  status: STATUS;
  isDeleted: boolean;
}