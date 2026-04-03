import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PermissionController } from "../../controllers/permission.controller";
import { createPermissionSchema, updatePermissionSchema } from "../../validations/permission.validation";

const permissionRouter = Router();

const permissionController = new PermissionController();

permissionRouter.post('/', validateRequest(createPermissionSchema), permissionController.createPermission);

permissionRouter.put('/:id', validateRequest(updatePermissionSchema), permissionController.updatePermission);

permissionRouter.get('/', permissionController.getPermissions);

permissionRouter.delete('/:id', permissionController.deletePermission);

permissionRouter.get('/:id', permissionController.getPermissionById);

export default permissionRouter;