import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { RoleController } from "../../controllers/masterCcontrollers/role.controller";
import { createRoleSchema, deleteRoleSchema, getRoleSchema, updateRoleSchema } from "../../validations/masterValidation/role.validation";


const roleRouter=Router();

const roleController=new RoleController();

roleRouter.post('/',validateRequest(createRoleSchema),roleController.create);

roleRouter.get('/',roleController.getAll);

roleRouter.post('/:id',validateRequest(updateRoleSchema),roleController.update);

roleRouter.get('/:id',validateRequest(getRoleSchema),roleController.getById);

roleRouter.delete('/:id',validateRequest(deleteRoleSchema),roleController.delete);

export default roleRouter;

