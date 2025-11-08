import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthProvider";
import { LayoutDashboard, Users, FileText, UserCheck, ShieldAlert, BarChart3, LogOut } from "lucide-react";

export default function AdminLayout() {
  const { doLogout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-2 flex-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
            <Users className="h-5 w-5" />
            User Management
          </Link>
          <Link to="/admin/posts" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
            <FileText className="h-5 w-5" />
            Post Management
          </Link>
          <Link to="/admin/friendships" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
            <UserCheck className="h-5 w-5" />
            Friendships
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
            <ShieldAlert className="h-5 w-5" />
            Reports
          </Link>
        </nav>
        <Button variant="ghost" onClick={doLogout} className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-gray-700">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 p-6 bg-gray-800 text-white overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}