import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as api from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "@/components/PostCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await api.searchAll(query);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setResults(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post._id !== deletedPostId)
    }));
  };

  if (loading) {
    return <div className="container max-w-2xl mx-auto py-6 px-4">Loading results...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Search results for "{query}"
      </h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users ({results.users.length})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({results.posts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {results.users.length > 0 ? (
                <div className="space-y-4">
                  {results.users.map(user => (
                    <Link
                      key={user._id}
                      to={`/profile/${user.username}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.fullname}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No users found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="mt-6 space-y-6">
          {results.posts.length > 0 ? (
            results.posts.map(post => (
              <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No posts found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}