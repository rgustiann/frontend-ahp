"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Kriteria } from "@/types/kriteria";
import { Supplier } from "@/types/supplier";

interface Props {
  kriteria: Kriteria;
  suppliers: Supplier[];
}
export default function TabelPerKriteria({ kriteria, suppliers }: Props) {
  const nilaiSupplier = suppliers.map((supplier) => {
    const nilaiObj = supplier.nilaiKriteria.find(
      (n) => n.kriteriaId === kriteria.id
    );

    return {
      id: supplier.id,
      namaSupplier: supplier.nama,
      bobot: nilaiObj?.nilai ?? 0,
    };
  });

  return (
    <div className="mt-10">
      <h2 className="text-2xl text-center font-semibold mb-2 dark:text-gray-300">Kriteria {kriteria.nama}</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Nama Supplier
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Bobot
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nilaiSupplier.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                    {item.namaSupplier}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                    {item.bobot.toFixed(4)}
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
