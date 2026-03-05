import { IUniversity } from "../../interfaces/masterInterfaces/university.interface";
import UniversityModel from "../../entities/university.model"
import { BadRequestError, ConflictError,NotFoundError } from "../../core/errors";
import mongoose from "mongoose";

export class UniversityService {


  create = async (data: IUniversity): Promise<IUniversity> => {
    const existing = await UniversityModel.findOne({ name: data.name });
    if (existing) throw new ConflictError("University already exists");
    const result = await UniversityModel.create(data);
    return result;
  };

  getAll = async (): Promise<IUniversity[]> => {
    return await UniversityModel.find().populate("country");
  };

  getById = async (id: string): Promise<IUniversity> => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError("Invalid University ID");
    const result = await UniversityModel
      .findById(id)
      .populate("country");
    if (!result) throw new Error("University not found");
    return result;
  };

  update = async (id: string,data: Partial<IUniversity>): Promise<IUniversity> => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid University ID");
    const result = await UniversityModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate("country");
    if (!result) throw new Error("University not found");
    return result;
  };

  delete = async (id: string): Promise<IUniversity> => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid University ID");
    const result = await UniversityModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundError("University not found");
    return result;
  };
}