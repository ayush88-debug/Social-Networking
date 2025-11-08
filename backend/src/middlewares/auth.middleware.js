import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, res, next)=>{
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!accessToken){
        throw new ApiError(400,"Unauthorized request")
    }

    const decoddedToken= jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    if(!decoddedToken){
        throw new ApiError(400, "Invalid Access Token")
    }

    const user=await User.findById(decoddedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(400, "Invalid Access Token")
    }

    req.user=user
    next()
})

export {verifyJWT}