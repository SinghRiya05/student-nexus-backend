import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { RolePermissionController } from "../../controllers/masterCcontrollers/role-permission.controller";
import { createRolePermissionSchema } from "../../validations/masterValidation/role-permission.validation";

const rolePermissionRouter = Router();

const rolePermissionController = new RolePermissionController();

// create or update role permissions
rolePermissionRouter.post(
  "/",
  validateRequest(createRolePermissionSchema),
  rolePermissionController.createOrUpdateRolePermissions
);

// get permissions by role
rolePermissionRouter.get(
  "/:roleId",
  rolePermissionController.getPermissionsByRole
);

// update permissions for role
rolePermissionRouter.put(
  "/:roleId",
  rolePermissionController.updatePermissionsForRole
);

// delete all permissions for role
rolePermissionRouter.delete(
  "/:roleId",
  rolePermissionController.deleteRolePermissions
);

// add permission to role
rolePermissionRouter.post(
  "/:roleId/:permissionId",
  rolePermissionController.addPermissionToRole
);

// remove permission from role
rolePermissionRouter.delete(
  "/:roleId/:permissionId",
  rolePermissionController.removePermissionFromRole
);

export default rolePermissionRouter;