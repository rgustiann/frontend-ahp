import { BestResult } from "@/components/allocation/BestResult";
import ResultTable from "@/components/allocation/Result";
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "AHP Procurement System | Ini Kasi nama perusahaan juga oke",
  description: "Sistem rekomendasi pengadaan barang dengan AHP",
};

export default function AHPCalculation() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-3xl dark:text-gray-300">Hasil AHP</h2>
      </div>
      <BestResult />
      <ResultTable />
    </div>
  );
}
