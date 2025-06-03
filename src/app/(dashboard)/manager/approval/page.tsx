"use client";
import React, { useEffect, useState } from "react";
import { getAllReports } from "@/lib/api/reportService";
import { ReportResponse } from "@/types/report";
import ManagerReportTable from "@/components/pelaporan/ManagerReportTable";

const ManagerPage = () => {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p className="p-4">Loading laporan...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Semua Laporan</h1>
      <ManagerReportTable reports={reports} refreshData={fetchReports} />
    </div>
  );
};

export default ManagerPage;
