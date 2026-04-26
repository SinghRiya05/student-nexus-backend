"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const user_model_1 = require("../models/user.model");
const errors_1 = require("../core/errors");
class RoleService {
    constructor() {
        this.create = async (data) => {
            const existingRole = await role_model_1.default.findOne({ name: data.name });
            if (existingRole)
                throw new errors_1.ConflictError("Role already exixts");
            const role = await role_model_1.default.create({
                name: data.name,
                description: data.description,
            });
            return role;
        };
        this.getAll = async () => {
            const roles = await role_model_1.default.find().sort({ createdAt: -1 });
            return roles;
        };
        this.getById = async (id) => {
            const role = await role_model_1.default.findById(id);
            if (!role)
                throw new errors_1.NotFoundError("Role not found");
            return role;
        };
        this.update = async (id, data) => {
            const role = await role_model_1.default.findById(id);
            if (!role)
                throw new errors_1.NotFoundError("Role not found");
            if (data.name) {
                const existingRole = await role_model_1.default.findOne({ name: data.name });
                if (existingRole && existingRole._id.toString() !== id)
                    throw new errors_1.ConflictError("Role name already exists");
                role.name = data.name;
            }
            if (data.description !== undefined) {
                role.description = data.description;
            }
            await role.save();
            return role;
        };
        this.delete = async (id) => {
            const deletedRole = await role_model_1.default.findByIdAndDelete(id);
            if (!deletedRole)
                throw new errors_1.NotFoundError("Role not found");
            return deletedRole;
        };
        this.assignRole = async (userId, roleId) => {
            const role = await role_model_1.default.findById(roleId);
            if (!role)
                throw new errors_1.NotFoundError("Role not found");
            const user = await user_model_1.userModel.findById(userId);
            if (!user)
                throw new errors_1.NotFoundError("User not found");
            user.roleId = role._id;
            await user.save();
            return user;
        };
    }
}
exports.RoleService = RoleService;
