"use client";

import React, { useEffect, useState } from "react";
import { DataGeneralStaff } from "@/components/visualization/DataGeneral";
import { getAllSuppliers } from "@/lib/api/supplierService";
import { getAllReports } from "@/lib/api/reportService";
import { useAuth } from "@/context/AuthContext";

export default function StaffHomePage() {
  const { user } = useAuth();
  const [supplierCount, setSupplierCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [suppliers, reports] = await Promise.all([
          getAllSuppliers(),
          getAllReports(),
        ]);
        console.log("suppliers", suppliers);
        setSupplierCount(suppliers.length);
        setReportCount(reports.length);
        console.log("Laporan di Home", reports);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="grid grid-cols-12 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <h1 className="font-bold text-6xl dark:text-gray-300">
          Selamat Datang, {user?.username || "Pengguna"}!
        </h1>
        <h2 className="dark:text-gray-400">
          Berikut adalah informasi yang tersimpan dalam basis data:
        </h2>
        <DataGeneralStaff
          supplierCount={supplierCount}
          reportCount={reportCount}
        />
      </div>
    </div>
  );
}
