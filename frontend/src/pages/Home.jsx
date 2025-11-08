import React, { useEffect, useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import * as api from "@/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    // To show the new post instantly, we need to populate the owner info
    // Or we can just refetch all posts
    fetchPosts();
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <div className="space-y-6">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-destructive">{error}</p>}
        
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}