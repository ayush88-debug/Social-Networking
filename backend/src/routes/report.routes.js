import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT to all routes
router.use(verifyJWT);

router.route("/").post(createReport);

export default router;