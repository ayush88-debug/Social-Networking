import React, { useEffect, useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import * as api from "../api";
import { useAuth } from "@/context/AuthProvider";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth(); 

  const fetchPosts = async () => {
    try {
      const allPosts = await api.getAllPosts();
      setPosts(allPosts);
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    
    const postWithOwner = {
      ...newPost,
      owner: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar
      }
    };
    setPosts([postWithOwner, ...posts]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <div className="space-y-6">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-destructive">{error}</p>}
        
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      </div>
    </div>
  );
}