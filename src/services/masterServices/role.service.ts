import RoleModel from "../../models/role.model";
import {IRole} from "../../interfaces/masterInterfaces/role.interface"
import { NotFoundError,ConflictError } from "../../core/errors";

export class RoleService{

    create=async(data:IRole)=>{
        const existingRole = await RoleModel.findOne({ name: data.name });
        if(existingRole) throw new ConflictError("Role already exixts");
        const role = await RoleModel.create({
        name: data.name,
        description: data.description,
        });
        return role;
    }

    getAll = async () => {
        const roles = await RoleModel.find().sort({ createdAt: -1 });
        return roles;
    };

    getById = async (id: string) => {
        const role = await RoleModel.findById(id);
        if (!role) throw new NotFoundError("Role not found");
        return role;
    };

    update = async (id: string, data: Partial<IRole>) => {
        const role = await RoleModel.findById(id);
        if (!role) throw new NotFoundError("Role not found");
        if (data.name) {
            const existingRole = await RoleModel.findOne({ name: data.name });
            if (existingRole && existingRole._id.toString() !== id) throw new ConflictError("Role name already exists");
            role.name = data.name;
        }
        if (data.description !== undefined) {
            role.description = data.description;
        }
        await role.save();
        return role;
    };

    delete = async (id: string) => {
    const deletedRole = await RoleModel.findByIdAndDelete(id);
    if (!deletedRole)  throw new NotFoundError("Role not found");
    return deletedRole;
};
}