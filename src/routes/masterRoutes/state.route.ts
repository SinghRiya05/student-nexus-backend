import { Router } from "express";
import { StateController } from "../../controllers/state.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createStateSchema, updateStateSchema } from "../../validations/state.validation";

const stateRouter = Router();

const stateController = new StateController();

stateRouter.post('/', validateRequest(createStateSchema), stateController.create);

stateRouter.put('/:id', validateRequest(updateStateSchema), stateController.update);

stateRouter.get('/', stateController.getAll);

stateRouter.delete('/:id', stateController.delete);

stateRouter.get('/:id', stateController.getById);

export default stateRouter;
