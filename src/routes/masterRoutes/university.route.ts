import { UniversityController } from "../../controllers/university.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { Router } from "express";
import { createUniversitySchema, universityIdParamsSchema, updateUniversitySchema, } from "../../validations/university.validation";

const router = Router();
const universityController = new UniversityController();

router.post("/", validateRequest(createUniversitySchema), universityController.createUniversity);
router.put("/:id", validateRequest(updateUniversitySchema), universityController.updateUniversity);
router.delete("/:id", validateRequest(universityIdParamsSchema), universityController.deleteUniversity);
router.get("/:id", validateRequest(universityIdParamsSchema), universityController.getUniversityById);
router.get("/", universityController.getAllUniversities);

export default router;