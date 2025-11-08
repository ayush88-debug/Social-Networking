import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X } from "lucide-react";
import { format } from "date-fns";

const getInitials = (name) => {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
};

const UserCell = ({ user }) => (
  <div className="flex items-center space-x-3">
    <Avatar>
      <AvatarImage src={user.avatar} alt={user.username} />
      <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium">{user.fullname}</div>
      <div className="text-sm text-muted-foreground">@{user.username}</div>
    </div>
  </div>
);

export const columns = (handleManageRequest) => [
  {
    accessorKey: "sender",
    header: "Sender",
    cell: ({ row }) => <UserCell user={row.original.sender} />,
  },
  {
    accessorKey: "receiver",
    header: "Receiver",
    cell: ({ row }) => <UserCell user={row.original.receiver} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "accepted"
          ? "bg-green-100 text-green-800"
          : status === "rejected"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800";
      return (
        <div
          className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium inline-block ${color}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Sent",
    cell: ({ row }) => <div>{format(new Date(row.original.createdAt), "PP")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;
      if (request.status !== "pending") {
        return null; // No actions if not pending
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleManageRequest(request._id, "accepted")}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Accept Request
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleManageRequest(request._id, "rejected")}>
              <X className="mr-2 h-4 w-4 text-red-500" />
              Reject Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];