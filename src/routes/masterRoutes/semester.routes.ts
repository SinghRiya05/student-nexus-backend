import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSemesterSchema, updateSemesterSchema, semesterIdParamsSchema } from "../../validations/semester.validation";
import { SemesterController } from "../../controllers/semester.controller";

const router = Router();
const semesterController = new SemesterController();

router.post("/", validateRequest(createSemesterSchema), semesterController.createSemester);
router.put("/:id", validateRequest(updateSemesterSchema), semesterController.updateSemester);
router.delete("/:id", validateRequest(semesterIdParamsSchema), semesterController.deleteSemester);
router.get("/course/:id", semesterController.getSemestersByCourseId);
router.get("/:id", validateRequest(semesterIdParamsSchema), semesterController.getSemesterById);
router.get("/", semesterController.getAllSemesters);

export default router;