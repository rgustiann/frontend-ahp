"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface HasilAHP {
  id: number;
  namaSupplier: string;
  nilaiAkhir: number;
  ranking: number;
}

export default function ResultTable() {
  const [hasilAHP, setHasilAHP] = useState<HasilAHP[]>([]);

  // Simulasi fetch dari API
  useEffect(() => {
    const fetchData = async () => {
      const data: HasilAHP[] = [
        { id: 1, namaSupplier: "Supplier A", nilaiAkhir: 0.45, ranking: 1 },
        { id: 2, namaSupplier: "Supplier B", nilaiAkhir: 0.35, ranking: 2 },
        { id: 3, namaSupplier: "Supplier C", nilaiAkhir: 0.2, ranking: 3 },
        { id: 4, namaSupplier: "Supplier D", nilaiAkhir: 0.15, ranking: 4 },
      ];
      setHasilAHP(data);
    };
    fetchData();
  }, []);

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                >
                  Nama Supplier
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                >
                  Nilai Akhir
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                >
                  Ranking
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasilAHP.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                    {item.namaSupplier}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                    {item.nilaiAkhir.toFixed(4)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-300">
                    {item.ranking}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
