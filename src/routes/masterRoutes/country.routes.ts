import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { countrySchema } from "../../validations/masterValidation/country.validation";
import { CountryController } from "../../controllers/masterCcontrollers/university.controller";

const userRouter = Router();
const countryController = new CountryController();

userRouter.post('/create', validateRequest(countrySchema), countryController.country);

export default userRouter;