import React, { useEffect, useState, useMemo } from "react";
import * as api from "../../api";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AdminFriendshipColumns";

export default function AdminFriendships() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetAllFriendRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to fetch friend requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleManageRequest = async (requestId, status) => {
    try {
      const updatedRequest = await api.adminManageFriendRequest(requestId, status);
      setRequests(
        requests.map((req) =>
          req._id === requestId ? updatedRequest : req
        )
      );
    } catch (err) {
      console.error(`Failed to ${status} request:`, err);
    }
  };

  const tableColumns = useMemo(() => columns(handleManageRequest), []);

  if (loading) return <p>Loading friend requests...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Friendship Management</h1>
      <DataTable columns={tableColumns} data={requests} />
    </div>
  );
}