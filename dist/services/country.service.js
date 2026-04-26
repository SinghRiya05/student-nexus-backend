"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const country_model_1 = __importDefault(require("../models/country.model"));
const errors_1 = require("../core/errors");
class CountryService {
    constructor() {
        this.create = async (data) => {
            const existingCountry = await country_model_1.default.findOne({ name: data.name, code: data.code });
            if (existingCountry)
                throw new errors_1.ConflictError("Country already exists");
            const country = await country_model_1.default.create(data);
            return country;
        };
        this.update = async (id, data) => {
            const country = await country_model_1.default.findByIdAndUpdate(id, data, { new: true });
            if (!country)
                throw new errors_1.NotFoundError("Country not found");
            return country;
        };
        this.findById = async (id) => {
            const country = await country_model_1.default.findById(id);
            if (!country)
                throw new errors_1.NotFoundError("Country not found");
            return country;
        };
        this.findAll = async () => {
            const countries = await country_model_1.default.find();
            return countries;
        };
        this.deleteById = async (id) => {
            const country = await country_model_1.default.findByIdAndDelete(id);
            if (!country)
                throw new errors_1.NotFoundError("Country not found");
        };
    }
}
exports.CountryService = CountryService;
