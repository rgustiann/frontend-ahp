"use client";
import React from "react";
import { ReportData } from "@/types/report";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
interface Props {
  reports: ReportData[];
}

const ReportTable: React.FC<Props> = ({ reports }) => {
  return (
    <div className="overflow-hidden rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Tanggal Laporan
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Nama Kebutuhan
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Jumlah
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                  {new Date(report.tanggal_laporan).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                  {report.nama_kebutuhan}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                  {report.jumlah_kebutuhan}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-medium ${
                      report.status === "approved"
                        ? "bg-green-500"
                        : report.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border space-x-2">
                  <a
                    href={report.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lihat PDF
                  </a>
                  <a
                    href={report.file_path}
                    download
                    className="text-green-600 hover:underline"
                  >
                    Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada laporan ditemukan.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;
