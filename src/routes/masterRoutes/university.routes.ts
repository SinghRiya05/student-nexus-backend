import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUniversitySchema, deleteUniversitySchema, getUniversityByIdSchema, updateUniversitySchema } from "../../validations/masterValidation/university.validation";
import { UniversityController } from "../../controllers/masterCcontrollers/university.controller";


const universityRouter=Router();

const universityController=new UniversityController();

universityRouter.post('/',validateRequest(createUniversitySchema),universityController.create);

universityRouter.get('/',universityController.getAll);

universityRouter.post('/:id',validateRequest(updateUniversitySchema),universityController.update);

universityRouter.get('/:id',validateRequest(getUniversityByIdSchema),universityController.getById);

universityRouter.delete('/:id',validateRequest(deleteUniversitySchema),universityController.delete);

export default universityRouter;

