import React, { useEffect, useState, useMemo } from "react";
import * as api from "../../api";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AdminPostColumns";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.adminDeletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  const tableColumns = useMemo(() => columns(handleDeletePost), []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Post Management</h1>
      <DataTable columns={tableColumns} data={posts} />
    </div>
  );
}