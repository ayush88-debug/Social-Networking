import { Router } from "express";
import { 
    userRegister,
    userLogin,
    userLogout,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    changeCurrentPassword,
    getUserProfile
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router =Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        },
    ]),
    userRegister
)

router.route("/login").post(userLogin)

router.route("/refresh-access-token").post(refreshAccessToken)

//secure routes
router.route("/logout").post(verifyJWT , userLogout)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/change-password").patch(verifyJWT, changeCurrentPassword)

router.route("/u/:username").get(verifyJWT, getUserProfile)

export default router