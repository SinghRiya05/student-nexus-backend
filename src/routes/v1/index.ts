import { Router } from "express";
import countryRouter from "../masterRoutes/country.routes"
const router = Router();

router.use("/country", countryRouter);

export default router;