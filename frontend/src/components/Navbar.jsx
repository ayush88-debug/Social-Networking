import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Home, Users, MessageSquare, Bell, Search, Menu } from "lucide-react";

export default function Navbar() {
  const { user, doLogout } = useAuth();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">SocialNet</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`
            }
          >
            <Home className="h-5 w-5" />
            Home
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`
            }
          >
            <Users className="h-5 w-5" />
            Friends
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground transition-colors hover:text-primary"}`
            }
          >
            <MessageSquare className="h-5 w-5" />
            Messages
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative w-full max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users, posts..."
              className="pl-10 h-9"
            />
          </div>

          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullname}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${user.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={doLogout} className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}