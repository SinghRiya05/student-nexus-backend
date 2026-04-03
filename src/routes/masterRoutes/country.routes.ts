import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCountrySchema, updateCountrySchema } from "../../validations/country.validation";
import { CountryController } from "../../controllers/country.controller";
const countryRouter = Router();
const countryController = new CountryController();

countryRouter.post('/', validateRequest(createCountrySchema), countryController.create);

countryRouter.put('/:id', validateRequest(updateCountrySchema), countryController.update);

countryRouter.get('/', countryController.getAll);

countryRouter.delete('/:id', countryController.delete);

countryRouter.get('/:id', countryController.getById);

export default countryRouter;