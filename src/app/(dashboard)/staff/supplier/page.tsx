import type { Metadata } from "next";
import React from "react";
import TabelSupplier from "@/components/supplier/SupplierTable";
export const metadata: Metadata = {
  title: "AHP Procurement System | Ini Kasi nama perusahaan juga oke",
  description: "Sistem rekomendasi pengadaan barang dengan AHP",
};

export default function Supplier() {
  return (
    <div>
        <TabelSupplier />
    </div>
  );
}
