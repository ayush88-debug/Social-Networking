import { Router } from "express";
import { 
    adminLogin,
    getAllUsers,
    deleteUser,
    updateUserRole,
    adminGetAllPosts,
    adminDeletePost,
    adminGetAllFriendRequests,
    adminManageFriendRequest,
    adminGetReports,
    adminUpdateReportStatus,
    getAnalytics
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/login").post(adminLogin);

// Protected Admin Routes
router.use(verifyJWT, verifyAdmin);

router.route("/analytics")
    .get(getAnalytics);

// User Management
router.route("/users")
    .get(getAllUsers);

router.route("/users/:userId")
    .delete(deleteUser);

router.route("/users/:userId/role")
    .patch(updateUserRole);

// Post Management
router.route("/posts")
    .get(adminGetAllPosts);

router.route("/posts/:postId")
    .delete(adminDeletePost);

// Friendship Management
router.route("/friendships")
    .get(adminGetAllFriendRequests);

router.route("/friendships/:requestId")
    .patch(adminManageFriendRequest);

// Reporting System
router.route("/reports")
    .get(adminGetReports);

router.route("/reports/:reportId")
    .patch(adminUpdateReportStatus);

export default router;