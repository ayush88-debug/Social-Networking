import { Router } from "express";
import {
    togglePostLike,
    getPostLikes
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:postId")
    .post(togglePostLike)
    .get(getPostLikes);

export default router;