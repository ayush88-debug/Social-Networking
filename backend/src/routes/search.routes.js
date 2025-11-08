import { Router } from "express";
import { searchAll } from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT to all routes
router.use(verifyJWT);

router.route("/").get(searchAll);

export default router;