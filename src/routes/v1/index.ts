import { Router } from "express";
import countryRouter from "../masterRoutes/country.routes"
import roleRouter from "../masterRoutes/role.routes";
import permissionRouter from "../masterRoutes/permission.routes";
import rolePermissionRouter from "../masterRoutes/role-permission.routes";
import stateRouter from "../masterRoutes/state.route";
import cityRouter from "../masterRoutes/city.route";
import universityRouter from "../masterRoutes/university.route";
import courseRouter from "../masterRoutes/course.routes";
import universityCourseRouter from "../masterRoutes/university-course.routes";
import semesterRouter from "../masterRoutes/semester.routes";
import authRouter from "../masterRoutes/auth.routes";
import followRouter from "../masterRoutes/follow.routes";
import chatRouter from "../masterRoutes/chat.routes";
import { middleware as authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.use("/country", countryRouter);
router.use("/state", stateRouter);
router.use("/city", cityRouter);
router.use("/role", roleRouter)
router.use("/permissions", permissionRouter)
router.use("/role-permissions", rolePermissionRouter)
router.use("/university", universityRouter);
router.use("/course", courseRouter);
router.use("/university-course", universityCourseRouter);
router.use("/semester", semesterRouter);
router.use("/auth", authRouter);
router.use("/follow", authMiddleware, followRouter);
router.use("/chat", authMiddleware, chatRouter);

export default router;