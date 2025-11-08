import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addCommentToPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        content,
        post: postId,
        owner: userId
    });

    const createdComment = await Comment.findById(comment._id)
        .populate("owner", "username fullname avatar");

    return res
        .status(201)
        .json(new ApiResponse(201, createdComment, "Comment added successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const comments = await Comment.find({ post: postId })
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content;
    await comment.save({ validateBeforeSave: false });
    
    const updatedComment = await Comment.findById(comment._id)
        .populate("owner", "username fullname avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
    addCommentToPost,
    getPostComments,
    updateComment,
    deleteComment
};