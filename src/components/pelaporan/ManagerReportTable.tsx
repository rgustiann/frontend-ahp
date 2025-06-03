// components/ManagerReportTable.tsx
"use client";
import React from "react";
import { ReportResponse } from "@/types/report";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { updateApproval } from "@/lib/api/reportService";
interface Props {
  reports: ReportResponse[];
  refreshData: () => void;
}

const ManagerReportTable: React.FC<Props> = ({ reports, refreshData }) => {
  const toCapitalCase = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const handleApprove = async (reportId: number) => {
    try {
      await updateApproval(reportId, {
        status: "disetujui",
        catatan_validasi: "Disetujui oleh manajer",
      });
      toast.success("Laporan disetujui");
      refreshData();
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyetujui laporan");
    }
  };

  const handleReject = async (reportId: number) => {
    try {
      await updateApproval(reportId, {
        status: "ditolak",
        catatan_validasi: "Ditolak oleh manajer",
      });
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
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Tanggal
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Username
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Kebutuhan
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Jumlah
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                PDF File
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-md dark:text-gray-400">
                  {new Date(report.tanggal_input).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-md dark:text-gray-400">
                  {report.username}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-md dark:text-gray-400">
                  {report.nama_kebutuhan}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-md dark:text-gray-400">
                  {report.jumlah_kebutuhan}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-md dark:text-gray-400">
                  <span
                    className={`py-2 text-center rounded text-white text-xs font-medium ${
                      report.status === "disetujui"
                        ? "bg-green-500 px-4"
                        : report.status === "ditolak"
                        ? "bg-red-500 px-5"
                        : "bg-yellow-500 px-2.5"
                    }`}
                  >
                    {toCapitalCase(report.status)}
                  </span>
                </TableCell>
                <TableCell className="px-4 flex justify-center py-2 space-x-2">
                  {report.file_path ? (
                    <div className="flex justify-center items-center space-x-4">
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
                        className="text-red-600 hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Tidak ada file</span>
                  )}
                </TableCell>
                <TableCell className="px-4 text-center py-2">
                  {report.status === "menunggu" ? (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="text-sm text-white bg-green-500 px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        className="text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">
                      Laporan {report.status}{" "}
                    </span>
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
