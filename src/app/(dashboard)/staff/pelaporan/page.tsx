// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReportByIdStaff } from "@/lib/api/reportService";
import { ReportData } from "@/types/report";
import ReportTable from "@/components/pelaporan/ReportTable";

export default function StaffReportPage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);

  useEffect(() => {
    if (!loading && user?.id) {
      getReportByIdStaff(user.id).then(setReports).catch(console.error);
    }
  }, [loading, user]);
  console.log("Laporan", reports)
  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Saya</h1>
      <ReportTable reports={reports} />
    </div>
  );
}
