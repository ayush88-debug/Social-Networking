import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            trim: true
        },
        mediaFile: {
            type: String, // Cloudinary URL
        }
    }, { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);