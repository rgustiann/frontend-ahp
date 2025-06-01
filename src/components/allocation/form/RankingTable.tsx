"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { SupplierRanking } from "@/types/ranking";

interface RankingTableProps {
  rankings: SupplierRanking[];
  isLoading?: boolean;
}

const RankingTable: React.FC<RankingTableProps> = ({
  rankings,
  isLoading = false,
}) => {
  const isEmpty = !isLoading && (!rankings || rankings.length === 0);
  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : isEmpty ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Tidak ada data yang ditemukan.
            </div>
          ) : (
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
                    Supply
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                  >
                    Ranking
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-200"
                  >
                    Alokasi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                      {item.supplierName}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                      {item.supplyName}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                      {item.ranking}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-md dark:text-white/90">
                      {item.alokasi}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
