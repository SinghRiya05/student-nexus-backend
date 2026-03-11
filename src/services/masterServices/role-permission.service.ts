import { Types } from "mongoose";
import { rolePermissionModel } from "../../models/role-permission.model";
import { IRolePermission } from "../../interfaces/masterInterfaces/role-permission.interface";
import RoleModel from "../../models/role.model";
import { permissionModel } from "../../models/permission.model";
import { NotFoundError, BadRequestError } from "../../core/errors";

export class RolePermissionService {

  async createOrUpdateRolePermissions(data: IRolePermission) {
    const { role, permissions } = data;
    if (!Types.ObjectId.isValid(role)) throw new BadRequestError("Invalid Role Id");
    const roleExists = await RoleModel.findById(role);
    if (!roleExists) throw new NotFoundError("Role not found");
    const permissionIds = permissions.map(p => new Types.ObjectId(p));
    const existingPermissions = await permissionModel.find({
      _id: { $in: permissionIds }
    });
    if (existingPermissions.length !== permissions.length) throw new BadRequestError("One or more permissions are invalid");
    return await rolePermissionModel.findOneAndUpdate(
      { role: new Types.ObjectId(role) },
      { permissions: permissionIds },
      { upsert: true, new: true }
    ).populate("role").populate("permissions");
  }

  async getPermissionsByRole(roleId: string) {
    if (!Types.ObjectId.isValid(roleId)) throw new BadRequestError("Invalid Role Id");
    const role = await RoleModel.findById(roleId);
    if (!role) throw new NotFoundError("Role not found");
    const rolePermission = await rolePermissionModel
      .findOne({ role: new Types.ObjectId(roleId) })
      .populate("permissions");
    if (!rolePermission) throw new NotFoundError("Permissions not assigned to this role");
    return rolePermission;
  }

  async updatePermissionsForRole(roleId: string, permissions: string[]) {
    if (!Types.ObjectId.isValid(roleId)) throw new BadRequestError("Invalid Role Id");
    const role = await RoleModel.findById(roleId);
    if (!role) throw new NotFoundError("Role not found");
    const permissionIds = permissions.map(p => new Types.ObjectId(p));
    const existingPermissions = await permissionModel.find({
      _id: { $in: permissionIds }
    });
    if (existingPermissions.length !== permissions.length) throw new BadRequestError("Invalid permission ids");
    return await rolePermissionModel.findOneAndUpdate(
      { role: new Types.ObjectId(roleId) },
      { permissions: permissionIds },
      { new: true }
    ).populate("role").populate("permissions");
  }

  async deleteRolePermissions(roleId: string) {
    if (!Types.ObjectId.isValid(roleId)) throw new BadRequestError("Invalid Role Id");
    const role = await RoleModel.findById(roleId);
    if (!role) throw new NotFoundError("Role not found");
    const deleted = await rolePermissionModel.findOneAndDelete({
      role: new Types.ObjectId(roleId)
    });
    if (!deleted) throw new NotFoundError("Role permissions not found");
    return deleted;
  }

  async addPermissionToRole(roleId: string, permissionId: string) {
    if (!Types.ObjectId.isValid(roleId) || !Types.ObjectId.isValid(permissionId)) throw new BadRequestError("Invalid Id");
    const role = await RoleModel.findById(roleId);
    if (!role) throw new NotFoundError("Role not found");
    const permission = await permissionModel.findById(permissionId);
    if (!permission) throw new NotFoundError("Permission not found");
    return await rolePermissionModel.findOneAndUpdate(
      { role: new Types.ObjectId(roleId) },
      { $addToSet: { permissions: new Types.ObjectId(permissionId) } },
      { upsert: true, new: true }
    ).populate("role").populate("permissions");
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    if (!Types.ObjectId.isValid(roleId) || !Types.ObjectId.isValid(permissionId)) {
      throw new BadRequestError("Invalid Id");
    }
    const role = await RoleModel.findById(roleId);
    if (!role) throw new NotFoundError("Role not found");
    const permission = await permissionModel.findById(permissionId);
    if (!permission) throw new NotFoundError("Permission not found");
    return await rolePermissionModel.findOneAndUpdate(
      { role: new Types.ObjectId(roleId) },
      { $pull: { permissions: new Types.ObjectId(permissionId) } },
      { new: true }
    ).populate("role").populate("permissions");
  }
}