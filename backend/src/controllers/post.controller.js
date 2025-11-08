import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteCloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const mediaFileLocalPath = req.file?.path;

    if (!content && !mediaFileLocalPath) {
        throw new ApiError(400, "Post must include content or a media file");
    }

    let mediaFile;
    if (mediaFileLocalPath) {
        mediaFile = await uploadOnCloudinary(mediaFileLocalPath);
        if (!mediaFile) {
            throw new ApiError(500, "Media file upload failed");
        }
    }

    const post = await Post.create({
        owner: req.user._id,
        content: content || "",
        mediaFile: mediaFile?.url || ""
    });

    const createdPost = await Post.findById(post._id);

    if (!createdPost) {
        throw new ApiError(500, "Failed to create post");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdPost, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const posts = await Post.find({ owner: user._id })
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "User posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required to update");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this post");
    }

    post.content = content;
    await post.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    // Delete media from Cloudinary if it exists
    if (post.mediaFile) {
        const publicId = post.mediaFile.split("/").pop().split(".")[0];
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    await Post.findByIdAndDelete(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully"));
});


export {
    createPost,
    getAllPosts,
    getUserPosts,
    updatePost,
    deletePost
};