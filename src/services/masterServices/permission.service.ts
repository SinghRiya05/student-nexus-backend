import { permissionModel } from "../../models/permission.model"
import { IPermission } from "../../interfaces/masterInterfaces/permission.interface";
import { BadRequestError,NotFoundError } from "../../core/errors";
import crypto from "crypto";


export class PermissionService {

    private generateRandomKey(): string {
        return `perm_${crypto.randomBytes(16).toString('hex')}`;
    }

    async createPermission(data: IPermission) {
        // Generate key if not provided
        if (!data.key) {
            data.key = this.generateRandomKey();
        }
        
        const permission = await permissionModel.findOne({ key: data.key });
        if(permission) throw new BadRequestError("Permission already exists");
        return await permissionModel.create(data);
    }

    async getPermissions() {
        return await permissionModel.find().sort({ createdAt: -1 });
    }

    async getPermissionById(id: string) {
        const permission = await permissionModel.findById(id);
        if(!permission) throw new NotFoundError("Permission not found");
        return permission;
    }

    async updatePermission(id: string, data: Partial<IPermission>) {
        const permission = await permissionModel.findByIdAndUpdate(id, data, { new: true });
        if(!permission) throw new NotFoundError("Permission not found");
        return permission;
    }

    async deletePermission(id: string) {
        const permission = await permissionModel.findByIdAndDelete(id);
        if(!permission) throw new NotFoundError("Permission not found");
        return permission;
    }

}