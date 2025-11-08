import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const columns = (handleUpdateStatus) => [
  {
    accessorKey: "reporter",
    header: "Reporter",
    cell: ({ row }) => (
      <Link 
        to={`/profile/${row.original.reporter.username}`} 
        className="hover:underline font-medium"
      >
        @{row.original.reporter.username}
      </Link>
    ),
  },
  {
    accessorKey: "reportedUser",
    header: "Reported User",
    cell: ({ row }) => (
      <Link 
        to={`/profile/${row.original.reportedUser.username}`} 
        className="hover:underline font-medium"
      >
        @{row.original.reportedUser.username}
      </Link>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.reason.replace(/_/g, " ")}
      </div>
    ),
  },
  {
    accessorKey: "reportedPost",
    header: "Reported Post",
    cell: ({ row }) => (
      <p className="max-w-xs truncate">
        {row.original.reportedPost?.content || "N/A (User Report)"}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "resolved"
          ? "bg-green-100 text-green-800"
          : status === "dismissed"
          ? "bg-gray-100 text-gray-800"
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
    header: "Date Reported",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "PP")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;
      if (report.status !== "pending") {
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
            <DropdownMenuItem onClick={() => handleUpdateStatus(report._id, "resolved")}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Mark as Resolved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(report._id, "dismissed")}>
              <X className="mr-2 h-4 w-4 text-gray-400" />
              Dismiss Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];