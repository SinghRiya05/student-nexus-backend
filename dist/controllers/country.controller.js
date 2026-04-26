"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const country_service_1 = require("../services/country.service");
const config_1 = require("../config");
const sendResponse_1 = require("../utils/sendResponse");
const countryService = new country_service_1.CountryService();
class CountryController {
    constructor() {
        this.create = async (req, res) => {
            const result = await countryService.create(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Country created successfully", result);
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            const result = await countryService.update(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Country updated successfully", result);
        };
        this.getAll = async (req, res) => {
            const result = await countryService.findAll();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Country fetched successfully", result);
        };
        this.getById = async (req, res) => {
            const id = req.params.id;
            const result = await countryService.findById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Country fetched successfully", result);
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            const result = await countryService.deleteById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Country deleted successfully", result);
        };
    }
}
exports.CountryController = CountryController;
