import React, { useEffect, useState } from "react";
import * as api from "../../api";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AdminUserColumns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user and all their data?")) {
      try {
        await api.adminDeleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsEditDialogOpen(true);
  };

  const handleRoleChangeSubmit = async () => {
    if (!selectedUser || !newRole) return;
    try {
      const updatedUser = await api.adminUpdateUserRole(selectedUser._id, newRole);
      setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <DataTable columns={columns(handleDeleteUser, handleEditRole)} data={users} />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Role for {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChangeSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}