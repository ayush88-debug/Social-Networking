import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send } from "lucide-react";

const ConversationList = () => {
  const conversations = [
    { id: 1, name: "Alice Smith", message: "Sounds good!", avatar: "/placeholder.svg" },
    { id: 2, name: "Bob Johnson", message: "See you then.", avatar: "/placeholder.svg" },
    { id: 3, name: "Carol White", message: "Okay, got it.", avatar: "/placeholder.svg" },
  ];

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-2">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
            >
              <Avatar>
                <AvatarImage src={convo.avatar} alt={convo.name} />
                <AvatarFallback>{getInitials(convo.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{convo.name}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.message}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 p-4 border-b">
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="Alice Smith" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Alice Smith</p>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-muted/20">
        <div className="flex justify-start">
          <div className="bg-muted text-muted-foreground p-3 rounded-lg max-w-xs">
            Hey! How are you?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
            I'm good, thanks! Just working on the new project. How about you?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-muted text-muted-foreground p-3 rounded-lg max-w-xs">
            Same here. Sounds good!
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <form className="flex space-x-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default function Messages() {
  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-4rem)]">
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
            <div className="hidden md:block">
              <ConversationList />
            </div>
            <div className="flex flex-col">
              <ChatWindow />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}