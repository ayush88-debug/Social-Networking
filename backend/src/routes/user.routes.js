import { Router } from "express";
import { 
    userRegister,
    userLogin,
    userLogout,
    refreshAccessToken
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

export default router