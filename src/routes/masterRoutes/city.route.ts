import { Router } from "express";
import { CityController } from "../../controllers/city.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCitySchema, updateCitySchema } from "../../validations/city.validation";

const cityRouter = Router();

const cityController = new CityController();

cityRouter.post('/', validateRequest(createCitySchema), cityController.create);

cityRouter.put('/:id', validateRequest(updateCitySchema), cityController.update);

cityRouter.get('/', cityController.getAll);

cityRouter.delete('/:id', cityController.delete);

cityRouter.get('/:id', cityController.getById);

export default cityRouter;
