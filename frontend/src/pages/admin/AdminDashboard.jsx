import React, { useEffect, useState } from "react";
import * as api from "../../api";
import StatsCard from "@/components/StatsCard";
import { Users, FileText, MessageCircle, Heart, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.adminGetAnalytics();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            description={`${stats.newUsersLast24h} new in last 24h`}
            icon={<Users className="h-4 w-4 text-gray-400" />}
          />
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            description={`${stats.newPostsLast24h} new in last 24h`}
            icon={<FileText className="h-4 w-4 text-gray-400" />}
          />
          <StatsCard
            title="Total Comments"
            value={stats.totalComments}
            icon={<MessageCircle className="h-4 w-4 text-gray-400" />}
          />
          <StatsCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={<Heart className="h-4 w-4 text-gray-400" />}
          />
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
}