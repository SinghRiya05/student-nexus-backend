import { Router } from "express";
import countryRouter from "../masterRoutes/country.routes"
import universityRouter from "../masterRoutes/university.routes";
import roleRouter from "../masterRoutes/role.routes";
import permissionRouter from "../masterRoutes/permission.routes";
import rolePermissionRouter from "../masterRoutes/role-permission.routes";
import courseRouter from "../masterRoutes/course.routes";
import semesterRouter from "../masterRoutes/semester.routes";
import userRouter from "../masterRoutes/user.routes";

const router = Router();

router.use("/country", countryRouter);
router.use("/university",universityRouter)
router.use("/role",roleRouter)
router.use("/permissions",permissionRouter)
router.use("/role-permissions",rolePermissionRouter)
router.use("/course",courseRouter)
router.use("/semester",semesterRouter)
router.use("/user",userRouter)

export default router;