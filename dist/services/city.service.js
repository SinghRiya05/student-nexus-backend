"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const city_model_1 = __importDefault(require("../models/city.model"));
const errors_1 = require("../core/errors");
const state_model_1 = __importDefault(require("../models/state.model"));
class CityService {
    constructor() {
        this.create = async (data) => {
            const existingState = await state_model_1.default.findById(data.stateId);
            if (!existingState)
                throw new errors_1.NotFoundError("State not found");
            const existingCity = await city_model_1.default.findOne({ name: data.name });
            if (existingCity)
                throw new errors_1.ConflictError("City already exists");
            const city = await city_model_1.default.create(data);
            return city;
        };
        this.update = async (id, data) => {
            const existingCity = await city_model_1.default.findOne({ name: data.name });
            if (existingCity)
                throw new errors_1.ConflictError("City already exists");
            const city = await city_model_1.default.findByIdAndUpdate(id, data, { new: true });
            if (!city)
                throw new errors_1.NotFoundError("City not found");
            return city;
        };
        this.findById = async (id) => {
            const city = await city_model_1.default.findById(id).populate("stateId");
            if (!city)
                throw new errors_1.NotFoundError("City not found");
            return city;
        };
        this.findAll = async () => {
            const cities = await city_model_1.default.find().populate("stateId");
            return cities;
        };
        this.deleteById = async (id) => {
            const city = await city_model_1.default.findByIdAndDelete(id);
            if (!city)
                throw new errors_1.NotFoundError("City not found");
        };
    }
}
exports.CityService = CityService;
