import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const existingLike = await Like.findOne({
        post: postId,
        likedBy: userId
    });

    let likeStatus;

    if (existingLike) {
        // User has already liked, so unlike it
        await Like.findByIdAndDelete(existingLike._id);
        likeStatus = "unliked";
    } else {
        // User has not liked, so like it
        await Like.create({
            post: postId,
            likedBy: userId
        });
        likeStatus = "liked";
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { likeStatus }, `Post ${likeStatus} successfully`));
});

const getPostLikes = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const likes = await Like.find({ post: postId })
        .populate("likedBy", "username fullname avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, likes, "Likes fetched successfully"));
});

export {
    togglePostLike,
    getPostLikes
};