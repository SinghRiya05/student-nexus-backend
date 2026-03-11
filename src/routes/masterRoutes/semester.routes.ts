import { Router } from "express";
import { SemesterController } from "../../controllers/masterCcontrollers/semester.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSemesterSchema, deleteSemesterSchema, getSemesterByIdSchema, updateSemesterSchema } from "../../validations/masterValidation/semester.validation";

const semesterRouter=Router();

const semesterController=new SemesterController();

semesterRouter.post("/",validateRequest(createSemesterSchema),semesterController.createSemester);

semesterRouter.post("/:id",validateRequest(updateSemesterSchema),semesterController.updateSemester);

semesterRouter.post("/:id",validateRequest(deleteSemesterSchema),semesterController.deleteSemester);

semesterRouter.post("/:id",validateRequest(getSemesterByIdSchema),semesterController.getSemesterById);

semesterRouter.post("/",semesterController.getSemesters);


export default semesterRouter;