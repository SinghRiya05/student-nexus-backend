import StateModel from "../models/state.model";
import { IState } from "../interfaces/masterInterfaces/state.interface"
import { ConflictError, NotFoundError } from "../core/errors";
import CountryModel from "../models/country.model";


export class StateService {

    create = async (data: IState): Promise<IState> => {
        const existingCountry = await CountryModel.findById(data.countryId);
        if (!existingCountry) throw new NotFoundError("Country not found");
        const existingState = await StateModel.findOne({ name: data.name });
        if (existingState) throw new ConflictError("State already exists");
        const state = await StateModel.create(data);
        return state;
    };

    update = async (id: string, data: Partial<IState>): Promise<IState> => {
        const existingState = await StateModel.findOne({ name: data.name });
        if (existingState) throw new ConflictError("State already exists");
        const state = await StateModel.findByIdAndUpdate(id, data, { new: true });
        if (!state) throw new NotFoundError("State not found");
        return state;
    };

    findById = async (id: string): Promise<IState> => {
        const state = await StateModel.findById(id);
        if (!state) throw new NotFoundError("State not found");
        return state;
    };

    findAll = async (): Promise<IState[]> => {
        const states = await StateModel.find();
        return states;
    }

    deleteById = async (id: string) => {
        const state = await StateModel.findByIdAndDelete(id);
        if (!state) throw new NotFoundError("State not found");
    }

}