import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import * as api from "../api";
import { format } from "date-fns";
import CommentSheet from "./CommentSheet"; // Import the new component

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [likesData, commentsData] = await Promise.all([
          api.getPostLikes(post._id),
          api.getPostComments(post._id),
        ]);
        
        setLikeCount(likesData.length);
        setIsLiked(likesData.some(like => like.likedBy._id === user._id));
        setCommentCount(commentsData.length);
      } catch (error) {
        console.error("Failed to fetch post stats:", error);
      }
    };
    fetchStats();
  }, [post._id, user._id]);

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const handleToggleLike = async () => {
    try {
      await api.togglePostLike(post._id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.deletePost(post._id);
        onPostDeleted(post._id);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.owner.avatar} alt={post.owner.username} />
              <AvatarFallback>{getInitials(post.owner.fullname)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link to={`/profile/${post.owner.username}`} className="font-semibold hover:underline">
                {post.owner.fullname}
              </Link>
              <p className="text-xs text-muted-foreground">
                @{post.owner.username} · {format(new Date(post.createdAt), "PP")}
              </p>
            </div>
            
            {(user._id === post.owner._id || user.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDeletePost} className="text-destructive">
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-2">
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.mediaFile && (
            <div className="mt-4 rounded-lg overflow-hidden border">
              {post.mediaFile.endsWith(".mp4") || post.mediaFile.endsWith(".mov") ? (
                <video src={post.mediaFile} controls className="w-full" />
              ) : (
                <img src={post.mediaFile} alt="Post media" className="w-full" />
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4">
          <div className="flex justify-around w-full">
            <Button variant="ghost" className="flex-1" onClick={handleToggleLike}>
              <Heart className={`h-5 w-5 mr-2 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
              {likeCount} Likes
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => setIsCommentSheetOpen(true)}>
              <MessageCircle className="h-5 w-5 mr-2" />
              {commentCount} Comments
            </Button>
            <Button variant="ghost" className="flex-1">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentSheet
        postId={post._id}
        isOpen={isCommentSheetOpen}
        onClose={() => setIsCommentSheetOpen(false)}
        onCommentAdded={() => setCommentCount(commentCount + 1)}
      />
    </>
  );
}