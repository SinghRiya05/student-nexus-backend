"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlumniService = void 0;
const user_model_1 = require("../models/user.model");
const role_model_1 = __importDefault(require("../models/role.model"));
class AlumniService {
    constructor() {
        // --- GET ALUMNI BY MY UNIVERSITY ---
        this.getAluminiByMyUniversity = async (authUserId) => {
            const alumniRole = await role_model_1.default.findOne({ name: "ALUMINI", isDeleted: false });
            if (!alumniRole) {
                throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
            }
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user) {
                throw new Error("User not found.");
            }
            const alumni = await user_model_1.userModel.find({
                roleId: alumniRole._id,
                universityId: user.universityId,
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            return alumni;
        };
        // --- GET ALUMNI BY MY COURSE ---
        this.getAluminiByMyCourse = async (authUserId) => {
            const alumniRole = await role_model_1.default.findOne({ name: "ALUMINI", isDeleted: false });
            if (!alumniRole) {
                throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
            }
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user) {
                throw new Error("User not found.");
            }
            const alumni = await user_model_1.userModel.find({
                roleId: alumniRole._id,
                courseIds: { $in: user.courseIds },
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            return alumni;
        };
        // GET ALUMNI BY UNIVERSITY
        this.getAluminiByUniversity = async (universityId, authUserId) => {
            const alumniRole = await role_model_1.default.findOne({ name: "ALUMINI", isDeleted: false });
            if (!alumniRole) {
                throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
            }
            const alumni = await user_model_1.userModel.find({
                roleId: alumniRole._id,
                universityId: universityId,
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            return alumni;
        };
        //  GET ALUMNI BY JOB TITLES WITH SAME UNIVERSITY OF AUTHUSER
        this.getAluminiByJobTitles = async (authUserId) => {
            const alumniRole = await role_model_1.default.findOne({ name: "ALUMINI", isDeleted: false });
            if (!alumniRole) {
                throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
            }
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user) {
                throw new Error("User not found.");
            }
            const alumni = await user_model_1.userModel.find({
                roleId: alumniRole._id,
                universityId: user.universityId,
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            const groupedMap = alumni.reduce((acc, curr) => {
                const jobTitle = curr.aluminiProfile?.jobTitle || "Other";
                if (!acc[jobTitle]) {
                    acc[jobTitle] = [];
                }
                acc[jobTitle].push(curr);
                return acc;
            }, {});
            const groupedAlumni = Object.keys(groupedMap).map(jobTitle => ({
                jobTitle,
                alumni: groupedMap[jobTitle]
            }));
            return groupedAlumni;
        };
        // GET ALUMNI BY COMPANY WITH SAME UNIVERSITY OF AUTHUSER
        this.getAluminiByCompany = async (authUserId) => {
            const alumniRole = await role_model_1.default.findOne({ name: "ALUMINI", isDeleted: false });
            if (!alumniRole) {
                throw new Error("Alumni role not found. Please ensure the 'ALUMINI' role exists in the database.");
            }
            const user = await user_model_1.userModel.findById(authUserId);
            if (!user) {
                throw new Error("User not found.");
            }
            const alumni = await user_model_1.userModel.find({
                roleId: alumniRole._id,
                universityId: user.universityId,
                _id: { $ne: authUserId },
                isDeleted: false
            })
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            const groupedMap = alumni.reduce((acc, curr) => {
                const company = curr.aluminiProfile?.currentCompany || "Other";
                if (!acc[company]) {
                    acc[company] = [];
                }
                acc[company].push(curr);
                return acc;
            }, {});
            const groupedAlumni = Object.keys(groupedMap).map(company => ({
                company,
                alumni: groupedMap[company]
            }));
            return groupedAlumni;
        };
        this.getAlumnibyId = async (id) => {
            const alumni = await user_model_1.userModel.findById(id)
                .populate("universityId")
                .populate("courseIds")
                .populate("aluminiProfile")
                .select("-password");
            return alumni;
        };
    }
}
exports.AlumniService = AlumniService;
