import UniversityModel from "../models/university.model";
import { IUniversity } from "../interfaces/masterInterfaces/university.interface";
import { ConflictError, NotFoundError } from "../core/errors";

export class UniversityService {

    createUniversity = async (universityData: IUniversity) => {
        const existingUniversity = await UniversityModel.findOne({ name: universityData.name });
        if (existingUniversity) throw new ConflictError("University already exists");
        return await UniversityModel.create(universityData);
    }

    getAllUniversities = async () => {
        return await UniversityModel.find();
    }

    getUniversityById = async (id: string) => {
        const existingUniversity = await UniversityModel.findById(id);
        if (!existingUniversity) throw new NotFoundError("University not found");
        return existingUniversity;
    }

    updateUniversity = async (id: string, universityData: Partial<IUniversity>) => {
        const existingUniversity = await UniversityModel.findById(id);
        if (!existingUniversity) throw new NotFoundError("University not found");
        if (universityData.name) {
            const duplicate = await UniversityModel.findOne({
                name: universityData.name,
                _id: { $ne: id },
            });
            if (duplicate) throw new ConflictError("University already exists");
        }
        return await UniversityModel.findByIdAndUpdate(id, universityData, { new: true, runValidators: true });
    }

    deleteUniversity = async (id: string) => {
        const existingUniversity = await UniversityModel.findById(id);
        if (!existingUniversity) throw new NotFoundError("University not found");
        return await UniversityModel.findByIdAndDelete(id);
    }

}