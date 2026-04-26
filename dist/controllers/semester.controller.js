"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterController = void 0;
const semester_service_1 = require("../services/semester.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const semesterService = new semester_service_1.SemesterService();
class SemesterController {
    constructor() {
        this.createSemester = async (req, res) => {
            const result = await semesterService.createSemester(req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "Semester created successfully", result);
        };
        this.getAllSemesters = async (req, res) => {
            const result = await semesterService.getAllSemesters();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Semesters fetched successfully", result);
        };
        this.getSemestersByCourseId = async (req, res) => {
            const id = req.params.id;
            const result = await semesterService.getSemestersByCourseId(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Semesters fetched successfully", result);
        };
        this.getSemesterById = async (req, res) => {
            const id = req.params.id;
            const result = await semesterService.getSemesterById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Semester fetched successfully", result);
        };
        this.updateSemester = async (req, res) => {
            const id = req.params.id;
            const result = await semesterService.updateSemester(id, req.body);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Semester updated successfully", result);
        };
        this.deleteSemester = async (req, res) => {
            const id = req.params.id;
            const result = await semesterService.deleteSemester(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Semester deleted successfully", result);
        };
    }
}
exports.SemesterController = SemesterController;
