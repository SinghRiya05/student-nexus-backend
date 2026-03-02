import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { countrySchema ,updateCountrySchema} from "../../validations/masterValidation/country.validation";
import { CountryController } from "../../controllers/masterCcontrollers/country.controller";
const countryRouter = Router();
const countryController = new CountryController();

countryRouter.post('/', validateRequest(countrySchema), countryController.create);

countryRouter.post('/:id', validateRequest(updateCountrySchema), countryController.update);

countryRouter.get('/', countryController.getAll);

countryRouter.delete('/:id', countryController.delete);

countryRouter.get('/:id',  countryController.getById);

export default countryRouter;