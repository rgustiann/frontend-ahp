import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { createReport, checkPDFStatus } from "@/lib/api/reportService";
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
  const [pdfStatus, setPdfStatus] = useState<{
    isProcessing: boolean;
    reportId?: number;
    pdfUrl?: string;
  }>({ isProcessing: false });

  // Poll PDF status jika sedang diproses
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pdfStatus.isProcessing && pdfStatus.reportId) {
      interval = setInterval(async () => {
        try {
          const status = await checkPDFStatus(pdfStatus.reportId!);
          if (status.pdf_ready) {
            setPdfStatus({
              isProcessing: false,
              reportId: pdfStatus.reportId,
              pdfUrl: status.pdf_url
            });
            
            toast.success("PDF berhasil dibuat!", {
              action: {
                label: "Buka PDF",
                onClick: () => window.open(status.pdf_url, '_blank')
              }
            });
          }
        } catch (error) {
          console.error("Error checking PDF status:", error);
          setPdfStatus(prev => ({ ...prev, isProcessing: false }));
        }
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pdfStatus.isProcessing, pdfStatus.reportId]);

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

      // Handle immediate PDF URL (old behavior)
      if (reportData.pdf_url) {
        toast.success("Report dan PDF berhasil dibuat!");
        window.open(reportData.pdf_url, '_blank');
        onGenerate(reportData.report_id);
      } 
      // Handle PDF processing (new optimized behavior)
      else if (reportData.pdf_processing) {
        toast.success("Report berhasil dibuat! PDF sedang diproses...");
        setPdfStatus({
          isProcessing: true,
          reportId: reportData.report_id
        });
        onGenerate(reportData.report_id);
      }
      
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat report"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Membuat Report...";
    if (pdfStatus.isProcessing) return "PDF Sedang Diproses...";
    return "Generate PDF & Create Report";
  };

  const getButtonIcon = () => {
    if (isLoading || pdfStatus.isProcessing) {
      return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleGenerateReport}
        className="ml-auto mb-4"
        disabled={isLoading || pdfStatus.isProcessing}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      {/* Show PDF ready notification */}
      {pdfStatus.pdfUrl && !pdfStatus.isProcessing && (
        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200">
          PDF siap! 
          <button 
            onClick={() => window.open(pdfStatus.pdfUrl, '_blank')}
            className="ml-2 text-green-700 underline hover:text-green-800"
          >
            Buka PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportButton;