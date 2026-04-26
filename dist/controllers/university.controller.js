"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityController = void 0;
const university_service_1 = require("../services/university.service");
const sendResponse_1 = require("../utils/sendResponse");
const config_1 = require("../config");
const catchAsync_1 = require("../core/catchAsync");
const cloudinaryUpload_1 = __importDefault(require("../utils/cloudinaryUpload"));
const universityService = new university_service_1.UniversityService();
class UniversityController {
    constructor() {
        this.createUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const files = req.files;
            let image = "";
            let logo = "";
            if (files?.image?.[0]) {
                const uploadedImage = await (0, cloudinaryUpload_1.default)(files.image[0]);
                image = uploadedImage.url;
            }
            if (files?.logo?.[0]) {
                const uploadedLogo = await (0, cloudinaryUpload_1.default)(files.logo[0]);
                logo = uploadedLogo.url;
            }
            const university = await universityService.createUniversity({ ...req.body, image, logo });
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.CREATED, true, "University created successfully", university);
        });
        this.getAllUniversities = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const universities = await universityService.getAllUniversities();
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "Universities fetched successfully", universities);
        });
        this.getUniversityById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const id = req.params.id;
            const university = await universityService.getUniversityById(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "University fetched successfully", university);
        });
        this.updateUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const files = req.files;
            const updateData = { ...req.body };
            if (files?.image?.[0]) {
                const uploadedImage = await (0, cloudinaryUpload_1.default)(files.image[0]);
                updateData.image = uploadedImage.url;
            }
            if (files?.logo?.[0]) {
                const uploadedLogo = await (0, cloudinaryUpload_1.default)(files.logo[0]);
                updateData.logo = uploadedLogo.url;
            }
            const id = req.params.id;
            const university = await universityService.updateUniversity(id, updateData);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "University updated successfully", university);
        });
        this.deleteUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const id = req.params.id;
            const university = await universityService.deleteUniversity(id);
            (0, sendResponse_1.sendResponse)(res, config_1.STATUS_CODES.SUCCESS, true, "University deleted successfully", university);
        });
    }
}
exports.UniversityController = UniversityController;
