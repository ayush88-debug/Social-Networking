import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthProvider";
import { LayoutDashboard, Users, FileText, UserCheck, ShieldAlert, LogOut } from "lucide-react";

export default function AdminLayout() {
  const { doLogout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/50 flex flex-col p-4 border-r">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-2 flex-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <Users className="h-5 w-5" />
            User Management
          </Link>
          <Link to="/admin/posts" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <FileText className="h-5 w-5" />
            Post Management
          </Link>
          <Link to="/admin/friendships" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <UserCheck className="h-5 w-5" />
            Friendships
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <ShieldAlert className="h-5 w-5" />
            Reports
          </Link>
        </nav>
        <Button variant="ghost" onClick={doLogout} className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-muted">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 p-6 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}