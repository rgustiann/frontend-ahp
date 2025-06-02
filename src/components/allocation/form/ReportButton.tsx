import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { createReport } from "@/lib/api/reportService";
import { SupplierRankingResponse, UsedCriteria } from "@/types/ranking";
import { CreateReportResponse } from "@/types/report";

interface ReportButtonProps {
  rankingData: {
    rankings: SupplierRankingResponse[];
    supplyData: {
      nama_supply: string;
      jumlah_kebutuhan: number;
      nama_pemesan: string;
      no_telp_pemesan: string;
    };
    usedCriteria: UsedCriteria[];
    catatan_validasi: string;
  };
  onGenerate: (reportId: number) => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  rankingData,
  onGenerate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const payload = {
        nama_supply: rankingData.supplyData.nama_supply,
        jumlah_kebutuhan: rankingData.supplyData.jumlah_kebutuhan,
        nama_pemesan: rankingData.supplyData.nama_pemesan,
        no_telp_pemesan: rankingData.supplyData.no_telp_pemesan,
        rankings: rankingData.rankings.map((r) => ({
          supplierName: r.supplierName,
          nama_supply: r.nama_supply,
          ranking: r.ranking,
          alokasi_kebutuhan: r.alokasi_kebutuhan,
        })),
        usedCriteria: rankingData.usedCriteria,
        catatan_validasi: rankingData.catatan_validasi,
      };

      const reportData: CreateReportResponse = await createReport(payload);

      toast.success("Report berhasil dibuat!");
      
      if (reportData.pdf_url) {
        window.open(reportData.pdf_url, '_blank');
      }
      onGenerate(reportData.report_id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat report"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateReport}
      className="ml-auto mb-4"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Membuat Report...
        </>
      ) : (
        "Generate PDF & Create Report"
      )}
    </Button>
  );
};

export default ReportButton;