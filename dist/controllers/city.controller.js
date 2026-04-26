"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityController = void 0;
const city_service_1 = require("../services/city.service");
const config_1 = require("../config");
const sendResponse_1 = require("../utils/sendResponse");
const cityService = new city_service_1.CityService();
class CityController {
    constructor() {
        this.create = async (req, res) => {
            const result = await cityService.create(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "City created successfully", result);
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            const result = await cityService.update(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "City updated successfully", result);
        };
        this.getById = async (req, res) => {
            const id = req.params.id;
            const result = await cityService.findById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "City fetched successfully", result);
        };
        this.getAll = async (req, res) => {
            const result = await cityService.findAll();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Cities fetched successfully", result);
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            const result = await cityService.deleteById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "City deleted successfully", result);
        };
    }
}
exports.CityController = CityController;
