"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AHPResult,
  ComparisonData,
  CriteriaComparisonData,
  ReportData,
} from "@/types/report";
import { Supplier, SupplierDetail } from "@/types/supplier";
import { Kriteria } from "@/types/kriteria";

interface AllocationData {
  suppliers: Supplier[];
  criteria: Kriteria[];
  selectedSupply: string;
  supplierDetails: Record<number, SupplierDetail[]>;
  comparisonData: ComparisonData;
  criteriaComparisonData: CriteriaComparisonData;
  jumlahKebutuhan: number;
  namaPemesan: string;
  noTelpPemesan: string;
  catatanValidasi: string;

  // UI State yang penting (user progress)
  showSupplierData: boolean;
  showRankingTable: boolean;
  isReportCreated: boolean;
  supplierTab: number;

  // Hasil perhitungan
  rankings: AHPResult[];
  consistencyRatios: { [key: string]: number };
  hasCalculated: boolean;
  reportData: ReportData | null;
}

// Default value kosong
const initialData: AllocationData = {
  suppliers: [],
  criteria: [],
  selectedSupply: "",
  supplierDetails: {},
  comparisonData: {},
  criteriaComparisonData: {},
  jumlahKebutuhan: 0,
  namaPemesan: "",
  noTelpPemesan: "",
  catatanValidasi: "",
  showSupplierData: false, 
  showRankingTable: false, 
  isReportCreated: false, 
  supplierTab: 1, 
  rankings: [],
  consistencyRatios: {},
  hasCalculated: false,
  reportData: null,
};

// Context
interface AllocationContextType {
  allocationData: AllocationData;
  updateAllocationData: (updates: Partial<AllocationData>) => void;
  clearAllocationData: () => void;
}
const AllocationContext = createContext<AllocationContextType | undefined>(
  undefined
);

// Hook penggunaan
export function useAllocation() {
  const context = useContext(AllocationContext);
  if (!context) {
    throw new Error("useAllocation must be used within AllocationProvider");
  }
  return context;
}
// Provider
export function AllocationProvider({ children }: { children: ReactNode }) {
  const [allocationData, setAllocationData] =
    useState<AllocationData>(initialData);

  const updateAllocationData = useCallback(
    (updates: Partial<AllocationData>) => {
      setAllocationData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const clearAllocationData = useCallback(() => {
    setAllocationData(initialData);
  }, []);

  const contextValue = useMemo(
    () => ({
      allocationData,
      updateAllocationData,
      clearAllocationData,
    }),
    [allocationData, updateAllocationData, clearAllocationData]
  );

  return (
    <AllocationContext.Provider value={contextValue}>
      {children}
    </AllocationContext.Provider>
  );
}
