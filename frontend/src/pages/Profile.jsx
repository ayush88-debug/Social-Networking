import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import * as api from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import EditProfileDialog from "@/components/EditProfileDialog";
import { Camera, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, postsData] = await Promise.all([
          api.getUserProfile(username),
          api.getUserPosts(username),
        ]);
        setProfile(profileData);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const updatedUser = await api.updateUserAvatar(formData);
      setUser(updatedUser);
      setProfile({ ...profile, avatar: updatedUser.avatar });
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const updatedUser = await api.updateUserCoverImage(formData);
      setUser(updatedUser);
      setProfile({ ...profile, coverImage: updatedUser.coverImage });
    } catch (error) {
      console.error("Failed to update cover image:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">User not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="overflow-hidden mb-6">
        <div className="h-48 md:h-64 bg-muted relative">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
          )}
          {isOwnProfile && (
            <label htmlFor="cover-upload" className="absolute bottom-4 right-4 cursor-pointer">
              <div className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <Camera className="h-5 w-5" />
              </div>
              <input
                id="cover-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
              />
            </label>
          )}
        </div>
        <CardHeader className="relative pb-0">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback className="text-4xl">{getInitials(profile.fullname)}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="bg-primary hover:bg-primary/90 text-primary-foreground p-1.5 rounded-full ring-2 ring-background transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-2xl font-bold">{profile.fullname}</CardTitle>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <Button onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
              ) : (
                <Button>Add Friend</Button> 
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {profile.bio && <p className="mb-4">{profile.bio}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              San Francisco, CA {/* Placeholder */}
            </div>
            <div className="flex items-center">
              <LinkIcon className="mr-1 h-4 w-4" />
              <a href="#" className="hover:underline text-primary">
                website.com {/* Placeholder */}
              </a>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6 space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">No posts yet.</p>
          )}
        </TabsContent>
        <TabsContent value="friends">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Friends list will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isOwnProfile && (
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}