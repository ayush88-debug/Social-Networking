import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reportedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reportedPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null // A report might be against a user directly, not a post
        },
        reason: {
            type: String,
            required: true,
            enum: ["spam", "harassment", "inappropriate_content", "hate_speech", "other"],
            default: "other"
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending"
        }
    }, { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);