import React, { useEffect, useState } from "react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };

  const fetchFriendsAndRequests = async () => {
    setLoading(true);
    try {
      const [friendsList, pendingRequests] = await Promise.all([
        api.getFriendsList(),
        api.getPendingRequests(),
      ]);
      setFriends(friendsList);
      setRequests(pendingRequests);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await api.acceptFriendRequest(requestId);
      fetchFriendsAndRequests();
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.rejectFriendRequest(requestId);
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const handleRemove = async (friendId) => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      try {
        await api.removeFriend(friendId);
        setFriends(friends.filter((friend) => friend._id !== friendId));
      } catch (error) {
        console.error("Failed to remove friend:", error);
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">My Friends</TabsTrigger>
          <TabsTrigger value="requests">
            Friend Requests
            {requests.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-xs">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Friends ({friends.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading friends...</p>
              ) : friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <Card key={friend._id} className="flex items-center justify-between p-4">
                      <Link to={`/profile/${friend.username}`} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar} alt={friend.username} />
                          <AvatarFallback>{getInitials(friend.fullname)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{friend.fullname}</p>
                          <p className="text-sm text-muted-foreground">@{friend.username}</p>
                        </div>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleRemove(friend._id)}>
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>You have no friends yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests ({requests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading requests...</p>
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <Card key={req._id} className="flex items-center justify-between p-4">
                      <Link to={`/profile/${req.sender.username}`} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={req.sender.avatar} alt={req.sender.username} />
                          <AvatarFallback>{getInitials(req.sender.fullname)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{req.sender.fullname}</p>
                          <p className="text-sm text-muted-foreground">@{req.sender.username}</p>
                        </div>
                      </Link>
                      <div className="flex space-x-2">
                        <Button size="icon" onClick={() => handleAccept(req._id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleReject(req._id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>You have no pending friend requests.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}