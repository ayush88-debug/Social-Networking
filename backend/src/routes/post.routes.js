import { Router } from "express";
import {
    createPost,
    getAllPosts,
    getUserPosts,
    updatePost,
    deletePost
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(upload.single("mediaFile"), createPost)
    .get(getAllPosts);

router.route("/u/:username").get(getUserPosts);

router.route("/:postId")
    .patch(updatePost)
    .delete(deletePost);

export default router;