import { ICountry } from "../../interfaces/masterInterfaces/country.interface";
import CountryModel from "../../entities/country.model";
import { NotFoundError } from "../../core/errors";
export class CountryService {

    create = async (data: ICountry): Promise<ICountry> => {
        const existingCountry = await CountryModel.findOne({name: data.name, code: data.code});
        if (existingCountry) {
            throw new NotFoundError("Country already exists");
        }
        const country = await CountryModel.create(data);

        return country;
    };

    update = async (id:string, data: Partial<ICountry>): Promise<ICountry> => {
        const country= await CountryModel.findByIdAndUpdate(id, data, { new: true });
        if (!country) {
            throw new NotFoundError("Country not found");
        }
        return country;
    };

    findById = async (id: string): Promise<ICountry> => {
        const country = await CountryModel.findById(id);
        if (!country) {
            throw new NotFoundError("Country not found");
        }
        return country;
    };

    findAll= async(): Promise<ICountry[]> => {
        const countries = await CountryModel.find();
        return countries;
    }

    deleteById=async(id:string)=>{
        const country=await CountryModel.findByIdAndDelete(id);
        if(!country){
            throw new NotFoundError("Country not found");
        }
    }

}