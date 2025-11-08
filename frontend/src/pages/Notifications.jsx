import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function to get initials
const getInitials = (name) => {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
};

// Static data for visual representation
const notifications = [
  {
    id: 1,
    type: "like",
    user: { name: "Alice Smith", username: "alicesmith", avatar: "/placeholder.svg" },
    content: "liked your post.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "comment",
    user: { name: "Bob Johnson", username: "bobjohnson", avatar: "/placeholder.svg" },
    content: "commented: \"Great shot!\"",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "request",
    user: { name: "Carol White", username: "carolwhite", avatar: "/placeholder.svg" },
    content: "sent you a friend request.",
    time: "1 day ago",
  },
];

const NotificationIcon = ({ type }) => {
  if (type === "like") {
    return (
      <div className="p-2 bg-red-100 rounded-full">
        <Heart className="h-5 w-5 text-red-500" />
      </div>
    );
  }
  if (type === "comment") {
    return (
      <div className="p-2 bg-blue-100 rounded-full">
        <MessageCircle className="h-5 w-5 text-blue-500" />
      </div>
    );
  }
  if (type === "request") {
    return (
      <div className="p-2 bg-green-100 rounded-full">
        <UserPlus className="h-5 w-5 text-green-500" />
      </div>
    );
  }
  return null;
};

export default function Notifications() {
  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex items-start p-4 space-x-4 hover:bg-muted/50 transition-colors">
                    <NotificationIcon type={item.type} />
                    <div className="flex-1 space-y-1">
                      <Link to={`/profile/${item.user.username}`} className="mr-1">
                        <Avatar className="h-8 w-8 inline-block mr-2">
                          <AvatarImage src={item.user.avatar} alt={item.user.username} />
                          <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold hover:underline">{item.user.name}</span>
                      </Link>
                      <span className="text-muted-foreground">{item.content}</span>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="p-6 text-center text-muted-foreground">You have no new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}