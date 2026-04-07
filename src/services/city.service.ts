import CityModel from "../models/city.model";
import { ICity } from "../interfaces/masterInterfaces/city.interface"
import { ConflictError, NotFoundError } from "../core/errors";
import StateModel from "../models/state.model";

export class CityService {

    create = async (data: ICity): Promise<ICity> => {
        const existingState = await StateModel.findById(data.stateId);
        if (!existingState) throw new NotFoundError("State not found");
        const existingCity = await CityModel.findOne({ name: data.name });
        if (existingCity) throw new ConflictError("City already exists");
        const city = await CityModel.create(data);
        return city;
    };

    update = async (id: string, data: Partial<ICity>): Promise<ICity> => {
        const existingCity = await CityModel.findOne({ name: data.name });
        if (existingCity) throw new ConflictError("City already exists");
        const city = await CityModel.findByIdAndUpdate(id, data, { new: true });
        if (!city) throw new NotFoundError("City not found");
        return city;
    };

    findById = async (id: string): Promise<ICity> => {
        const city = await CityModel.findById(id).populate("stateId");
        if (!city) throw new NotFoundError("City not found");
        return city;
    };

    findAll = async (): Promise<ICity[]> => {
        const cities = await CityModel.find().populate("stateId");
        return cities;
    }

    deleteById = async (id: string) => {
        const city = await CityModel.findByIdAndDelete(id);
        if (!city) throw new NotFoundError("City not found");
    }

}