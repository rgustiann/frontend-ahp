"use client";
import React from "react";
import Button from "@/components/ui/button/Button";

interface PDFButtonProps {
  reportId: number;
  onGenerate: (reportId: number) => void;
}

const PDFButton: React.FC<PDFButtonProps> = ({ reportId, onGenerate }) => {
  return (
    <Button onClick={() => onGenerate(reportId)} className="ml-auto mb-4">
      Buat PDF
    </Button>
  );
};

export default PDFButton;