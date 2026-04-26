"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlumniController = void 0;
const alumni_service_1 = require("../services/alumni.service");
const catchAsync_1 = require("../core/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const alumniService = new alumni_service_1.AlumniService();
class AlumniController {
    constructor() {
        // --- GET ALUMNI FROM MY UNIVERSITY ---
        this.getAlumniByMyUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId)
                throw new Error("User's university association not found.");
            const alumni = await alumniService.getAluminiByMyUniversity(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni from your university fetched successfully.", alumni);
        });
        this.getAlumniById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const alumni = await alumniService.getAlumnibyId(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni fetched successfully.", alumni);
        });
        // --- GET ALUMNI FROM MY COURSE ---
        this.getAlumniByMyCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.courseIds)
                throw new Error("User's course association not found.");
            const alumni = await alumniService.getAluminiByMyCourse(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni from your course fetched successfully.", alumni);
        });
        // --- GET ALUMNI BY UNIVERSITY ---
        this.getAlumniByUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { universityId } = req.params;
            const user = req.user;
            const alumni = await alumniService.getAluminiByUniversity(universityId, user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni from your university fetched successfully.", alumni);
        });
        // --- GET ALUMNI BY JOB TITLES ---
        this.getAluminiByJobTitles = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId) {
                throw new Error("User's university association not found.");
            }
            const alumni = await alumniService.getAluminiByJobTitles(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni from your job titles fetched successfully.", alumni);
        });
        // --- GET ALUMNI BY COMPANY ---
        this.getAluminiByCompany = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const user = req.user;
            if (!user || !user.universityId)
                throw new Error("User's university association not found.");
            const alumni = await alumniService.getAluminiByCompany(user._id.toString());
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Alumni from your company fetched successfully.", alumni);
        });
    }
}
exports.AlumniController = AlumniController;
