"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/useToast";
import InputSupplyStep from "@/components/allocation/form/InputSupplyForm";
import { Step2FormCard } from "@/components/allocation/form/InputStep2Form";
import RankingTable from "@/components/allocation/form/RankingTable";
import ReportButton from "@/components/allocation/form/ReportButton";
import StepIndicator from "@/components/allocation/form/StepIndicator";
import ErrorBoundary from "@/components/ui/boundary/ErrorBoundary";
import { SupplierRankingResponse, UsedCriteria } from "@/types/ranking";

// Better state management with enum
type AppStep = "welcome" | "input-supply" | "criteria" | "view-ranking";

interface SupplyData {
  nama_supply: string;
  jumlah_kebutuhan: number;
  nama_pemesan: string;
  no_telp_pemesan: string;
}

interface RankingData {
  rankings: SupplierRankingResponse[];
  supplyData: SupplyData;
  usedCriteria: UsedCriteria[];
  catatan_validasi: string;
}

interface AppState {
  currentStep: AppStep;
  reportId: number | null;
  rankings: SupplierRankingResponse[];
  error: string | null;
  supplyData: SupplyData | null;
  rankingData: RankingData | null; // NEW: Store all ranking data
}

const initialState: AppState = {
  currentStep: "welcome",
  reportId: null,
  rankings: [],
  error: null,
  supplyData: null,
  rankingData: null,
};

export default function ReportPage() {
  const [state, setState] = useState<AppState>(initialState);
  const { showToast } = useToast();

  // Computed values
  const hasRankingData = useMemo(
    () => state.rankings.length > 0,
    [state.rankings.length]
  );

  // Action handlers
  const startProcess = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "input-supply", error: null }));
  }, []);

  const handleStep1Success = useCallback((supplyData: SupplyData) => {
    setState((prev) => ({
      ...prev,
      supplyData: supplyData,
      currentStep: "criteria",
    }));
  }, []);

  // CHANGED: Handle ranking generation (not report creation)
  const handleRankingGenerated = useCallback((rankingData: RankingData) => {
    setState((prev) => ({
      ...prev,
      rankingData: rankingData,
      rankings: rankingData.rankings,
      currentStep: "view-ranking",
    }));
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setState(initialState);
  }, []);

  const handleCloseCriteria = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "input-supply" }));
  }, []);

  const handleCloseSupply = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "welcome" }));
  }, []);

  const handleGeneratePDF = useCallback(
    (id: number) => {
      showToast("Generating PDF...", "info");
      console.log("Generate PDF", id);
    },
    [showToast]
  );

  // Render different states
  const renderContent = () => {
    switch (state.currentStep) {
      case "welcome":
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Sistem Alokasi Supply
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Kelola kebutuhan supply dan dapatkan rekomendasi supplier
                terbaik berdasarkan kriteria yang Anda tentukan.
              </p>
              <button
                onClick={startProcess}
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Mulai Proses Alokasi
              </button>
            </div>
          </div>
        );

      case "view-ranking":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hasil Ranking Supplier
              </h2>
              <div className="flex gap-3">
                {/* CHANGED: Pass ranking data instead of reportId */}
                {state.rankingData && (
                  <ReportButton
                    rankingData={state.rankingData}
                    onGenerate={handleGeneratePDF}
                  />
                )}
                <button
                  onClick={handleBackToWelcome}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Reset Halaman
                </button>
              </div>
            </div>

            {state.error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-400">{state.error}</p>
              </div>
            ) : hasRankingData ? (
              <RankingTable rankings={state.rankings} />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Tidak ada data ranking tersedia
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          {state.currentStep !== "welcome" && (
            <StepIndicator currentStep={state.currentStep} totalSteps={4} />
          )}

          <main className="mt-6">{renderContent()}</main>

          <InputSupplyStep
            isOpen={state.currentStep === "input-supply"}
            onClose={handleCloseSupply}
            onNext={handleStep1Success}
          />

          <Step2FormCard
            isOpen={state.currentStep === "criteria"}
            onClose={handleCloseCriteria}
            supplyData={state.supplyData || undefined}
            onSuccess={handleRankingGenerated} // CHANGED: Now handles ranking generation
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
