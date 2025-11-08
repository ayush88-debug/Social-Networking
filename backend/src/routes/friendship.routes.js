import { Router } from "express";
import {
    sendFriendRequest,
    getPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    removeFriend
} from "../controllers/friendship.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT to all friendship routes
router.use(verifyJWT);

router.route("/request/:receiverId").post(sendFriendRequest);
router.route("/pending").get(getPendingRequests);
router.route("/accept/:requestId").patch(acceptFriendRequest);
router.route("/reject/:requestId").patch(rejectFriendRequest);
router.route("/list").get(getFriendsList);
router.route("/remove/:friendId").delete(removeFriend);

export default router;