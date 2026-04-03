import { Router } from "express";
import countryRouter from "../masterRoutes/country.routes"
import roleRouter from "../masterRoutes/role.routes";
import permissionRouter from "../masterRoutes/permission.routes";
import rolePermissionRouter from "../masterRoutes/role-permission.routes";
import stateRouter from "../masterRoutes/state.route";
import cityRouter from "../masterRoutes/city.route";

const router = Router();

router.use("/country", countryRouter);
router.use("/state", stateRouter);
router.use("/city", cityRouter);
router.use("/role", roleRouter)
router.use("/permissions", permissionRouter)
router.use("/role-permissions", rolePermissionRouter)

export default router;