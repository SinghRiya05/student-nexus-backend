import { UniversityController } from "../../controllers/university.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { Router } from "express";
import { uploadImage } from "../../middlewares/imageUpload.middleware";
import { createUniversitySchema, universityIdParamsSchema, updateUniversitySchema, } from "../../validations/university.validation";

const router = Router();
const universityController = new UniversityController();

router.post(
    "/",
    uploadImage.fields([{ name: "image", maxCount: 1 }, { name: "logo", maxCount: 1 }]),
    validateRequest(createUniversitySchema), universityController.createUniversity);
router.put(
    "/:id",
    uploadImage.fields([{ name: "image", maxCount: 1 }, { name: "logo", maxCount: 1 }]),
    validateRequest(updateUniversitySchema), universityController.updateUniversity);
router.delete("/:id", validateRequest(universityIdParamsSchema), universityController.deleteUniversity);
router.get("/:id", validateRequest(universityIdParamsSchema), universityController.getUniversityById);
router.get("/", universityController.getAllUniversities);

export default router;