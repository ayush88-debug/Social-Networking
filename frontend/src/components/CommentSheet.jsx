import React, { useState, useEffect } from "react";
import * as api from "../api";
import { useAuth } from "@/context/AuthProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function CommentSheet({ postId, isOpen, onClose, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };

  useEffect(() => {
    if (isOpen) {
      const fetchComments = async () => {
        setLoading(true);
        try {
          const data = await api.getPostComments(postId);
          setComments(data);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchComments();
    }
  }, [postId, isOpen]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const addedComment = await api.addCommentToPost(postId, { content: newComment });
      setComments([addedComment, ...comments]);
      onCommentAdded(); // Update comment count on PostCard
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={comment.owner.avatar} alt={comment.owner.username} />
                  <AvatarFallback>{getInitials(comment.owner.fullname)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Link to={`/profile/${comment.owner.username}`} className="font-semibold text-sm hover:underline">
                      {comment.owner.fullname}
                    </Link>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(comment.createdAt), "PPp")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No comments yet.</p>
          )}
        </div>
        <SheetFooter>
          <form onSubmit={handleSubmitComment} className="flex w-full space-x-2 p-4 border-t">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}