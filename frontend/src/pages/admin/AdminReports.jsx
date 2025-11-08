import React, { useEffect, useState, useMemo } from "react";
import * as api from "../../api";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AdminReportColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetReports();
      setReports(data);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, status) => {
    try {
      const updatedReport = await api.adminUpdateReportStatus(reportId, status);
      setReports(
        reports.map((r) =>
          r._id === reportId ? updatedReport : r
        )
      );
    } catch (err) {
      console.error(`Failed to update report:`, err);
    }
  };

  const tableColumns = useMemo(() => columns(handleUpdateStatus), []);

  const filteredReports = (status) => {
    if (status === "all") return reports;
    return reports.filter(report => report.status === status);
  };

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reporting System</h1>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <Card className="mt-4 bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <TabsContent value="pending">
              <DataTable columns={tableColumns} data={filteredReports("pending")} />
            </TabsContent>
            <TabsContent value="resolved">
              <DataTable columns={tableColumns} data={filteredReports("resolved")} />
            </TabsContent>
            <TabsContent value="dismissed">
              <DataTable columns={tableColumns} data={filteredReports("dismissed")} />
            </TabsContent>
            <TabsContent value="all">
              <DataTable columns={tableColumns} data={filteredReports("all")} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}