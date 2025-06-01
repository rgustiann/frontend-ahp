// components/ManagerReportTable.tsx
"use client";
import React from "react";
import { ReportData } from "@/types/report";
import axiosInstance from "@/lib/api/axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
interface Props {
  reports: ReportData[];
  refreshData: () => void;
}

const ManagerReportTable: React.FC<Props> = ({ reports, refreshData }) => {
  const handleApprove = async (reportId: number) => {
    try {
      await axiosInstance.post(`/reports/approve/${reportId}`);
      toast.success("Laporan disetujui");
      refreshData();
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyetujui laporan");
    }
  };

  const handleReject = async (reportId: number) => {
    try {
      await axiosInstance.post(`/reports/reject/${reportId}`);
      toast.success("Laporan ditolak");
      refreshData();
    } catch (err) {
      console.log(err);
      toast.error("Gagal menolak laporan");
    }
  };

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
                Tanggal
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Username
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Kebutuhan
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
                  {report.username}
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
                  {report.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        className="text-sm text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
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

export default ManagerReportTable;
