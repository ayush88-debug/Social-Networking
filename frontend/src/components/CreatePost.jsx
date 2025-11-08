import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Video, X } from "lucide-react";
import * as api from "@/api";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !mediaFile) {
      setError("Please add some content or a file to post.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    if (mediaFile) {
      formData.append("mediaFile", mediaFile);
    }

    try {
      const newPost = await api.createPost(formData);
      onPostCreated(newPost);
      setContent("");
      clearMedia();
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={`What's on your mind, ${user.fullname}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 border-none shadow-none focus-visible:ring-0"
            />
          </div>

          {preview && (
            <div className="relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={clearMedia}
              >
                <X className="h-4 w-4" />
              </Button>
              {mediaFile.type.startsWith("image/") ? (
                <img src={preview} alt="Preview" className="rounded-lg max-h-80 w-full object-contain" />
              ) : (
                <video src={preview} controls className="rounded-lg max-h-80 w-full" />
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-blue-500" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Video className="h-5 w-5 text-red-500" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}