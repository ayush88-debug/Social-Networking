import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

const getInitials = (name) => {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
};

export const columns = (handleDeletePost) => [
  {
    accessorKey: "owner",
    header: "Author",
    cell: ({ row }) => {
      const owner = row.original.owner;
      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={owner.avatar} alt={owner.username} />
            <AvatarFallback>{getInitials(owner.fullname)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{owner.fullname}</div>
            <div className="text-sm text-gray-400">@{owner.username}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <p className="max-w-xs truncate">{row.original.content || "Media post"}</p>
    ),
  },
  {
    accessorKey: "mediaFile",
    header: "Media",
    cell: ({ row }) => {
      const mediaFile = row.original.mediaFile;
      if (!mediaFile) return "None";
      
      const isVideo = mediaFile.endsWith(".mp4") || mediaFile.endsWith(".mov");
      return (
        <a 
          href={mediaFile} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline"
        >
          {isVideo ? "Video Link" : "Image Link"}
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Posted",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "PP")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleDeletePost(post._id)}
            >
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];