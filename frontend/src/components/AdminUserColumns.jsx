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

export const columns = (handleDeleteUser, handleEditRole) => [
  {
    accessorKey: "fullname",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={row.original.avatar} alt={row.original.username} />
          <AvatarFallback>{getInitials(row.original.fullname)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.fullname}</div>
          <div className="text-sm text-muted-foreground">@{row.original.username}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium inline-block ${
        row.original.role === 'admin' 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-secondary text-secondary-foreground'
      }`}>
        {row.original.role}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "PP")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditRole(user)}>
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteUser(user._id)}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];