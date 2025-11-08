import mongoose from "mongoose";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReport = asyncHandler(async (req, res) => {
    const { reportedUserId, postId, reason } = req.body;
    const reporterId = req.user._id;

    if (!reportedUserId) {
        throw new ApiError(400, "reportedUserId is required");
    }

    if (!reason) {
        throw new ApiError(400, "A reason for the report is required");
    }

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
        throw new ApiError(404, "User to be reported not found");
    }
    
    if (postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post to be reported not found");
        }
        // Ensure the post owner matches the reported user
        if (post.owner.toString() !== reportedUserId) {
            throw new ApiError(400, "Post owner and reported user do not match");
        }
    }
    
    const newReport = await Report.create({
        reporter: reporterId,
        reportedUser: reportedUserId,
        reportedPost: postId || null,
        reason: reason
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newReport, "Report submitted successfully"));
});

export {
    createReport
};