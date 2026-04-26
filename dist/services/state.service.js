"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const state_model_1 = __importDefault(require("../models/state.model"));
const errors_1 = require("../core/errors");
const country_model_1 = __importDefault(require("../models/country.model"));
class StateService {
    constructor() {
        this.create = async (data) => {
            const existingCountry = await country_model_1.default.findById(data.countryId);
            if (!existingCountry)
                throw new errors_1.NotFoundError("Country not found");
            const existingState = await state_model_1.default.findOne({ name: data.name });
            if (existingState)
                throw new errors_1.ConflictError("State already exists");
            const state = await state_model_1.default.create(data);
            return state.populate("countryId");
        };
        this.update = async (id, data) => {
            const existingState = await state_model_1.default.findOne({ name: data.name });
            if (existingState)
                throw new errors_1.ConflictError("State already exists");
            const state = await state_model_1.default.findByIdAndUpdate(id, data, { new: true });
            if (!state)
                throw new errors_1.NotFoundError("State not found");
            return state.populate("countryId");
        };
        this.findById = async (id) => {
            const state = await state_model_1.default.findById(id).populate("countryId");
            if (!state)
                throw new errors_1.NotFoundError("State not found");
            return state;
        };
        this.findAll = async () => {
            const states = await state_model_1.default.find().populate("countryId");
            return states;
        };
        this.deleteById = async (id) => {
            const state = await state_model_1.default.findByIdAndDelete(id);
            if (!state)
                throw new errors_1.NotFoundError("State not found");
        };
    }
}
exports.StateService = StateService;
