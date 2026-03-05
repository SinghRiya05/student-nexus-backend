import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PermissionController } from "../../controllers/masterCcontrollers/permission.controller";
import { createPermissionSchema, updatePermissionSchema } from "../../validations/masterValidation/permission.validation";

const permissionRouter = Router();

const permissionController = new PermissionController();

permissionRouter.post('/', validateRequest(createPermissionSchema), permissionController.createPermission);

permissionRouter.post('/:id', validateRequest(updatePermissionSchema), permissionController.updatePermission);

permissionRouter.get('/', permissionController.getPermissions);

permissionRouter.delete('/:id', permissionController.deletePermission);

permissionRouter.get('/:id',  permissionController.getPermissionById);

export default permissionRouter;