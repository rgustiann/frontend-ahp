"use client";
import React, { useState, useEffect } from "react";
import TabelPerKriteria from "@/components/ahp-calculation/TabelPerKriteria";
import { Kriteria } from "@/types/kriteria";
import { Supplier } from "@/types/supplier";
// import { getAllKriteria } from "@/lib/api/kriteriaservice";
// import { getAllSuppliers } from "@/lib/api/supplierservice";

export default function Perhitungan() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  useEffect(() => {
    // NOTE: Uncomment jika API sudah tersedia
    /*
    const fetchData = async () => {
      try {
        const kriteriaRes = await getAllKriteria();
        const supplierRes = await getAllSuppliers();
        setKriteriaList(kriteriaRes);
        setSupplierList(supplierRes);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchData();
    */

    // Dummy Data sementara
    const dummyKriteria: Kriteria[] = [
      { id: 1, kode: "C1", nama: "Layanan", pertimbangan: "benefit" },
      { id: 2, kode: "C2", nama: "Harga", pertimbangan: "cost" },
    ];

    const dummySupplier: Supplier[] = [
      {
        id: 1,
        nama: "Supplier A",
        alamat: "Jl. Mawar",
        contact: "08123456789",
        keterangan: "Terpercaya",
      },
      {
        id: 2,
        nama: "Supplier B",
        alamat: "Jl. Melati",
        contact: "08234567891",
        keterangan: "Tepat waktu",
      },
      {
        id: 3,
        nama: "Supplier C",
        alamat: "Jl. Anggrek",
        contact: "08345678912",
        keterangan: "Murah",
      },
    ];
    setKriteriaList(dummyKriteria);
    setSupplierList(dummySupplier);
  }, []);
  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl dark:text-gray-300">
          Perhitungan Kriteria
        </h2>
      </div>
      {kriteriaList.map((kriteria) => (
        <TabelPerKriteria
          key={kriteria.id}
          kriteria={kriteria}
          suppliers={supplierList}
        />
      ))}
    </div>
  );
}
