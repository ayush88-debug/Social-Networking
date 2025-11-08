import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

const searchAll = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res
            .status(200)
            .json(new ApiResponse(200, { users: [], posts: [] }, "Empty query"));
    }

    const queryRegex = new RegExp(q, 'i'); 

    
    const users = await User.find({
        $or: [
            { username: { $regex: queryRegex } },
            { fullname: { $regex: queryRegex } }
        ]
    }).select("fullname username avatar");

    
    const posts = await Post.find({
        content: { $regex: queryRegex }
    }).populate("owner", "username fullname avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, { users, posts }, "Search results fetched successfully"));
});

export {
    searchAll
};