import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendFriendRequest = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiving user not found");
    }

    if (receiver.friends.includes(senderId)) {
        throw new ApiError(400, "You are already friends with this user");
    }

    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });

    if (existingRequest) {
        if (existingRequest.status === "pending") {
            throw new ApiError(400, "Friend request already sent");
        }
        if (existingRequest.status === "accepted") {
            throw new ApiError(400, "You are already friends with this user");
        }
    }

    const newRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newRequest, "Friend request sent successfully"));
});

const getPendingRequests = asyncHandler(async (req, res) => {
    const requests = await FriendRequest.find({
        receiver: req.user._id,
        status: "pending"
    }).populate("sender", "username fullname avatar");

    if (!requests || requests.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No pending friend requests found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, requests, "Pending friend requests fetched successfully"));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
        throw new ApiError(404, "Friend request not found");
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to accept this request");
    }

    if (request.status !== "pending") {
        throw new ApiError(400, "This request has already been actioned");
    }

    request.status = "accepted";
    await request.save({ validateBeforeSave: false });

    // Add to both users' friends lists
    await User.findByIdAndUpdate(request.sender, {
        $push: { friends: request.receiver }
    });
    
    await User.findByIdAndUpdate(request.receiver, {
        $push: { friends: request.sender }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, request, "Friend request accepted"));
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
        throw new ApiError(404, "Friend request not found");
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to reject this request");
    }

    if (request.status !== "pending") {
        throw new ApiError(400, "This request has already been actioned");
    }

    request.status = "rejected";
    await request.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, request, "Friend request rejected"));
});

const getFriendsList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("friends", "username fullname avatar");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user.friends, "Friends list fetched successfully"));
});

const removeFriend = asyncHandler(async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friend = await User.findById(friendId);
    if (!friend) {
        throw new ApiError(404, "User not found");
    }

    // Remove from both users' friends lists
    await User.findByIdAndUpdate(userId, {
        $pull: { friends: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
        $pull: { friends: userId }
    });

    // Find and update the original friend request
    await FriendRequest.findOneAndUpdate({
        $or: [
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId }
        ],
        status: "accepted"
    }, {
        $set: { status: "rejected" } // Or simply delete the request
    });
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Friend removed successfully"));
});

export {
    sendFriendRequest,
    getPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    removeFriend
};