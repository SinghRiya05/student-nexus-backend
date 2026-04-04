import { STATUS } from "../../config";

export interface ISemester {
  name: string;
  description?: string;
  status?: STATUS;
}
