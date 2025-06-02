"use client";
import React from "react";
import Button from "@/components/ui/button/Button";

interface ReportButtonProps {
  reportId: number;
  onGenerate: (reportId: number) => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  reportId,
  onGenerate,
}) => {
  return (
    <Button onClick={() => onGenerate(reportId)} className="ml-auto mb-4">
      Buat Laporan
    </Button>
  );
};

export default ReportButton;
