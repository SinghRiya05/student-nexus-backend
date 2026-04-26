"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateController = void 0;
const state_service_1 = require("../services/state.service");
const config_1 = require("../config");
const sendResponse_1 = require("../utils/sendResponse");
const stateService = new state_service_1.StateService();
class StateController {
    constructor() {
        this.create = async (req, res) => {
            const result = await stateService.create(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "State created successfully", result);
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            const result = await stateService.update(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "State updated successfully", result);
        };
        this.getById = async (req, res) => {
            const id = req.params.id;
            const result = await stateService.findById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "State fetched successfully", result);
        };
        this.getAll = async (req, res) => {
            const result = await stateService.findAll();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "States fetched successfully", result);
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            const result = await stateService.deleteById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "State deleted successfully", result);
        };
    }
}
exports.StateController = StateController;
