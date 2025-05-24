import type { Metadata } from "next";
import { DataGeneralStaff } from "@/components/visualization/DataGeneral";
import React from "react";
export const metadata: Metadata = {
  title: "AHP Procurement System | Ini Kasi nama perusahaan juga oke",
  description: "Sistem rekomendasi pengadaan barang dengan AHP",
};

export default function StaffHomePage() {
  return (
    <div className="grid grid-cols-12 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <h1 className="font-bold text-6xl dark:text-gray-300"> Selamat Datang. Pak Manager!</h1>
            <h2 className="dark:text-gray-400">PALAKAU </h2>
            <DataGeneralStaff />
          </div>
        </div>
  );
}
