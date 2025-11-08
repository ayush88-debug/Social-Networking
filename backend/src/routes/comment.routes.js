import { Router } from "express";
import {
    addCommentToPost,
    getPostComments,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:postId")
    .post(addCommentToPost)
    .get(getPostComments);

router.route("/:commentId")
    .patch(updateComment)
    .delete(deleteComment);

export default router;