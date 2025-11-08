import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "./user.controller.js";
import { deleteFromCloudinary } from "../utils/deleteCloudinary.js";

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "Admin user not found");
    }

    if (user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to access the admin panel");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Admin Logged In Successfully"
            )
        );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
    }
    if (user.coverImage) {
        const publicId = user.coverImage.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
    }

    await Post.deleteMany({ owner: userId });
    await Comment.deleteMany({ owner: userId });
    await Like.deleteMany({ likedBy: userId });
    await FriendRequest.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User and all associated data deleted successfully"));
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User role updated successfully"));
});

// === Post Management ===

const adminGetAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "All posts fetched successfully"));
});

const adminDeletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.mediaFile) {
        const publicId = post.mediaFile.split("/").pop().split(".")[0];
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully by admin"));
});

// === Friendship Management ===

const adminGetAllFriendRequests = asyncHandler(async (req, res) => {
    const requests = await FriendRequest.find()
        .populate("sender", "username fullname avatar")
        .populate("receiver", "username fullname avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, requests, "All friend requests fetched successfully"));
});

const adminManageFriendRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const request = await FriendRequest.findById(requestId);
    if (!request) {
        throw new ApiError(404, "Friend request not found");
    }
    
    if (request.status !== 'pending') {
        throw new ApiError(400, "Request has already been actioned");
    }

    request.status = status;
    await request.save({ validateBeforeSave: false });

    if (status === 'accepted') {
        await User.findByIdAndUpdate(request.sender, {
            $push: { friends: request.receiver }
        });
        await User.findByIdAndUpdate(request.receiver, {
            $push: { friends: request.sender }
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, request, `Friend request ${status}`));
});

export {
    adminLogin,
    getAllUsers,
    deleteUser,
    updateUserRole,
    adminGetAllPosts,
    adminDeletePost,
    adminGetAllFriendRequests,
    adminManageFriendRequest
};