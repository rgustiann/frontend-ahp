"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ErrorBoundary from "@/components/ui/boundary/ErrorBoundary";
import { Kriteria } from "@/types/kriteria";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSupplierBySupply,
  getSuppliesBySupplier,
  getUniqueNamaSupply,
} from "@/lib/api/supplierService";
import { toast } from "sonner";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Supplier, SupplierDetail } from "@/types/supplier";
import { getAllKriteria } from "@/lib/api/kriteriaService";
// Tambahkan di bagian import
import {
  createReport,
  generateRanking,
  checkPDFStatus,
} from "@/lib/api/reportService";
import {
  AHPResult,
  ComparisonMatrix,
  CreateReportPayload,
  CriteriaComparisonReport,
  GenerateRankingPayload,
  ReportData,
  SupplierComparisonReport,
  SupplierComparisons,
} from "@/types/report";
import Select from "@/components/form/Select";
import Link from "next/link";

// Types
interface ComparisonData {
  [criteriaId: number]: {
    [supplierA: number]: {
      [supplierB: number]: number;
    };
  };
}

interface CriteriaComparisonData {
  [criteriaA: number]: {
    [criteriaB: number]: number;
  };
}

const CONSISTENCY_INDEX: { [key: number]: number } = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

type AHPOption = {
  value: number;
  label: string;
};

export default function ReportPage() {
  // Ini buat datanya ya
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [criteria, setCriteria] = useState<Kriteria[]>([]);
  const [supplyOptions, setSupplyOptions] = useState<string[]>([]);
  const [selectedSupply, setSelectedSupply] = useState("");
  const [supplierDetails, setSupplierDetails] = useState<
    Record<number, SupplierDetail[]>
  >({});

  // trus inu buat dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tini bagian perbandingan
  const [supplierTab, setSupplierTab] = useState(1);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({});
  const [criteriaComparisonData, setCriteriaComparisonData] =
    useState<CriteriaComparisonData>({});

  const [isLoading, setIsLoading] = useState(false);
  const [rankings, setRankings] = useState<AHPResult[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [consistencyRatios, setConsistencyRatios] = useState<{
    [key: string]: number;
  }>({});

  const [jumlahKebutuhan, setJumlahKebutuhan] = useState<number>(0);
  const [, setReportData] = useState<ReportData | null>(null);
  const [namaPemesan, setNamaPemesan] = useState("");
  const [noTelpPemesan, setNoTelpPemesan] = useState("");
  const [catatanValidasi, setCatatanValidasi] = useState("");
  const [showSupplierData, setShowSupplierData] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showRankingTable, setShowRankingTable] = useState(false);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [, setHasCalculated] = useState(false);
  const [isReportCreated, setIsReportCreated] = useState(false);

  const generateAHPDropdownOptions = (
    rowName: string,
    colName: string
  ): AHPOption[] => {
    const options: AHPOption[] = [];

    // Kolom (B) lebih penting dari baris (A)
    for (let i = 9; i >= 2; i--) {
      options.push({
        value: 1 / i,
        label: `${colName} lebih penting dari ${rowName} (1/${i})`,
      });
    }

    // Sama penting
    options.push({
      value: 1,
      label: "Sama penting",
    });

    // Baris (A) lebih penting dari kolom (B)
    for (let i = 2; i <= 9; i++) {
      options.push({
        value: i,
        label: `${rowName} lebih penting dari ${colName} (${i})`,
      });
    }

    return options;
  };

  useEffect(() => {
    const isValid =
      selectedSupply.trim() !== "" &&
      namaPemesan.trim() !== "" &&
      noTelpPemesan.trim() !== "" &&
      jumlahKebutuhan > 0;
    setIsFormValid(isValid);
  }, [selectedSupply, namaPemesan, noTelpPemesan, jumlahKebutuhan]);
  useEffect(() => {
    const fetchSupplyOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const options = await getUniqueNamaSupply();
        setSupplyOptions(options);
        setFilteredOptions(options);
      } catch (error) {
        toast.error("Gagal memuat daftar supply");
        console.error("Error fetching supply options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchSupplyOptions();
  }, []);

  const handleSearchSupplier = () => {
    if (!isFormValid) {
      toast.error("Lengkapi semua data yang diperlukan");
      return;
    }
    setShowSupplierData(true);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(supplyOptions);
    } else {
      const filtered = supplyOptions.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, supplyOptions]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const fetchSuppliers = useCallback(async (supplyType: string) => {
    if (!supplyType) return;

    try {
      setIsLoading(true);
      const response = await getSupplierBySupply(supplyType);
      const data = await response;
      setSuppliers(data || []);

      const supplierDetailsMap: Record<number, SupplierDetail[]> = {};
      for (const supplier of data || []) {
        try {
          const details = await getSuppliesBySupplier(supplier.id);
          supplierDetailsMap[supplier.id] = details;
        } catch (error) {
          console.warn(
            `Gagal mengambil data untuk supplier ${supplier.nama}:`,
            error
          );
          supplierDetailsMap[supplier.id] = [];
        }
      }

      setSupplierDetails(supplierDetailsMap);
    } catch (error) {
      toast.error("Gagal memuat data supplier");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCriteria = useCallback(async () => {
    try {
      const response = await getAllKriteria();
      const data = await response;
      setCriteria(data || []);
      if (data.length > 0) {
        setSupplierTab(data[0].id);
      }
    } catch (error) {
      toast.error("Gagal memuat data kriteria");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (selectedSupply) {
      fetchSuppliers(selectedSupply);
    }
    fetchCriteria();
  }, [selectedSupply, fetchSuppliers, fetchCriteria]);

  useEffect(() => {
    const newCriteriaData: CriteriaComparisonData = {};
    criteria.forEach((criteriaA) => {
      newCriteriaData[criteriaA.id] = {};
      criteria.forEach((criteriaB) => {
        if (criteriaA.id !== criteriaB.id) {
          newCriteriaData[criteriaA.id][criteriaB.id] = 1;
        }
      });
    });
    setCriteriaComparisonData(newCriteriaData);

    const newComparisonData: ComparisonData = {};
    criteria.forEach((criterion) => {
      newComparisonData[criterion.id] = {};
      suppliers.forEach((supplierA) => {
        newComparisonData[criterion.id][supplierA.id] = {};
        suppliers.forEach((supplierB) => {
          if (supplierA.id !== supplierB.id) {
            newComparisonData[criterion.id][supplierA.id][supplierB.id] = 1;
          }
        });
      });
    });
    setComparisonData(newComparisonData);
  }, [criteria, suppliers]);

  const getReciprocalValue = (value: number): number => {
    return Math.round((1 / value) * 100) / 100;
  };

  const calculateCriteriaWeights = (): { [key: number]: number } => {
    if (criteria.length === 0) return {};

    const matrix: number[][] = criteria.map((criteriaA) =>
      criteria.map((criteriaB) => {
        if (criteriaA.id === criteriaB.id) return 1;
        return criteriaComparisonData[criteriaA.id]?.[criteriaB.id] || 1;
      })
    );

    const weights = calculateAHPWeights(matrix);

    const weightsMap: { [key: number]: number } = {};
    criteria.forEach((criterion, index) => {
      weightsMap[criterion.id] = weights[index];
    });

    return weightsMap;
  };

  const handleCreateReport = async () => {
    if (!namaPemesan.trim()) {
      toast.error("Nama pemesan harus diisi");
      return;
    }
    if (!noTelpPemesan.trim()) {
      toast.error("No telepon pemesan harus diisi");
      return;
    }
    if (jumlahKebutuhan <= 0) {
      toast.error("Jumlah kebutuhan tidak valid");
      return;
    }

    const criteriaComparisons: CriteriaComparisonReport[] = [];
    criteria.forEach((a) => {
      criteria.forEach((b) => {
        if (a.id !== b.id) {
          criteriaComparisons.push({
            criteria_a_id: a.id,
            criteria_b_id: b.id,
            comparison_value: criteriaComparisonData[a.id]?.[b.id] || 1,
          });
        }
      });
    });

    const supplierComparisons: SupplierComparisonReport[] = [];
    criteria.forEach((criterion) => {
      const comparisons = comparisonData[criterion.id];
      for (const supplierA in comparisons) {
        for (const supplierB in comparisons[supplierA]) {
          supplierComparisons.push({
            criteria_id: criterion.id,
            supplier_a_id: parseInt(supplierA),
            supplier_b_id: parseInt(supplierB),
            comparison_value: comparisons[supplierA][supplierB],
          });
        }
      }
    });

    try {
      setIsLoading(true);
      setIsCreatingReport(true);
      const transformedRankings = rankings.map((result) => ({
        supplierId: result.supplierId,
        supplierName: result.supplierName,
        nama_supply: selectedSupply,
        ranking: result.ranking,
        alokasi_kebutuhan: result.jumlah_alokasi,
        score: result.score,
      }));
      const criteriaWeights = calculateCriteriaWeights();
      const criteriaWeightsArray = criteria.map((criterion) => ({
        criteria_id: criterion.id,
        weight_value: criteriaWeights[criterion.id] || 0,
      }));
      const usedCriteria = criteria.map((criterion) => ({
        criteriaName: criterion.nama,
        criteriaValue: criteriaWeights[criterion.id] || 0,
      }));
      console.log("Consistency Ratios before submit:", consistencyRatios);
      const consistencyRatioValue = consistencyRatios?.["criteria"] ?? null;
      console.log("Consistency Ratios Values before submit:", consistencyRatioValue);
      const payload: CreateReportPayload = {
        nama_supply: selectedSupply,
        jumlah_kebutuhan: jumlahKebutuhan,
        nama_pemesan: namaPemesan,
        no_telp_pemesan: noTelpPemesan,
        catatan_validasi: catatanValidasi,
        rankings: transformedRankings,
        usedCriteria: usedCriteria,
        criteria_comparisons: criteriaComparisons,
        supplier_comparisons: supplierComparisons,
        criteria_weights: criteriaWeightsArray,
        consistency_ratios: {
          criteria: consistencyRatioValue,
        },
      };

      const response = await createReport(payload);

      setReportData(response);
      toast.success("Laporan berhasil disimpan");
      setIsReportCreated(true);
      if (response.pdf_processing) {
        checkPDFGeneration(response.report_id);
      }
    } catch (error) {
      toast.error("Gagal membuat laporan");
      console.error("Create report error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const checkPDFGeneration = async (reportId: number) => {
    const maxAttempts = 10;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await checkPDFStatus(reportId);

        if (response.pdf_ready && response.pdf_url) {
          toast.success("PDF Selesai Dibuat");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 3000);
        } else {
          toast.error("PDF generation timeout");
        }
      } catch (error) {
        console.error("PDF status check error:", error);
      }
    };

    checkStatus();
  };

  const handleSupplyChange = (supply: string) => {
    setSelectedSupply(supply);
    setSearchTerm(supply);
    setComparisonData({});
    setCriteriaComparisonData({});
    setRankings([]);
    setIsDropdownOpen(false);
    setErrors({});
    setConsistencyRatios({});
    setHasCalculated(false);
    setShowRankingTable(false);
    setIsCreatingReport(false);
    setIsReportCreated(false);
  };

  // Handle dropdown input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // Handle dropdown selection
  const handleDropdownSelect = (option: string) => {
    handleSupplyChange(option);
  };

  // Handle criteria comparison change
  const handleCriteriaComparisonChange = (
    criteriaA: number,
    criteriaB: number,
    value: number
  ) => {
    setCriteriaComparisonData((prev) => {
      const newData = { ...prev };

      // Set the main value
      if (!newData[criteriaA]) newData[criteriaA] = {};
      newData[criteriaA][criteriaB] = value;

      // Set the reciprocal value
      if (!newData[criteriaB]) newData[criteriaB] = {};
      newData[criteriaB][criteriaA] = getReciprocalValue(value);

      return newData;
    });

    // Clear error for this comparison
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`criteria_${criteriaA}_${criteriaB}`];
      return newErrors;
    });
  };

  // Handle supplier comparison change
  const handleSupplierComparisonChange = (
    criteriaId: number,
    supplierA: number,
    supplierB: number,
    value: number
  ) => {
    setComparisonData((prev) => {
      const newData = { ...prev };

      // Ensure nested structure exists
      if (!newData[criteriaId]) newData[criteriaId] = {};
      if (!newData[criteriaId][supplierA]) newData[criteriaId][supplierA] = {};
      if (!newData[criteriaId][supplierB]) newData[criteriaId][supplierB] = {};

      // Set the main value
      newData[criteriaId][supplierA][supplierB] = value;

      // Set the reciprocal value
      newData[criteriaId][supplierB][supplierA] = getReciprocalValue(value);

      return newData;
    });

    // Clear error for this comparison
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`supplier_${criteriaId}_${supplierA}_${supplierB}`];
      return newErrors;
    });
  };

  const calculateConsistencyRatio = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n <= 2) return 0;

    // Calculate column sums
    const colSums = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        colSums[j] += matrix[i][j];
      }
    }

    // Normalize matrix
    const normalizedMatrix = matrix.map((row) =>
      row.map((val, j) => val / colSums[j])
    );

    // Calculate priorities (row averages)
    const priorities = normalizedMatrix.map(
      (row) => row.reduce((sum, val) => sum + val, 0) / n
    );

    // Calculate weighted sum
    const weightedSum = matrix.map((row) =>
      row.reduce((sum, val, j) => sum + val * priorities[j], 0)
    );

    // Calculate consistency vector
    const consistencyVector = weightedSum.map((val, i) => val / priorities[i]);
    const lambdaMax = consistencyVector.reduce((sum, val) => sum + val, 0) / n;

    // Calculate CI and CR
    const ci = (lambdaMax - n) / (n - 1);
    const ri = CONSISTENCY_INDEX[n] || 1.49;

    return ci / ri;
  };

  // Calculate AHP weights using Geometric Mean Method
  const calculateAHPWeights = (matrix: number[][]): number[] => {
    const n = matrix.length;
    const weights = [];

    for (let i = 0; i < n; i++) {
      let product = 1;
      for (let j = 0; j < n; j++) {
        product *= matrix[i][j];
      }
      weights.push(Math.pow(product, 1 / n));
    }

    // Normalize weights
    const sum = weights.reduce((total, weight) => total + weight, 0);
    return weights.map((weight) => weight / sum);
  };

  // Validate all comparisons
  const validateComparisons = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};
    const newConsistencyRatios: { [key: string]: number } = {};
    let hasErrors = false;

    // Validate criteria comparisons
    const criteriaMatrix: number[][] = criteria.map((criteriaA) =>
      criteria.map((criteriaB) => {
        if (criteriaA.id === criteriaB.id) return 1;
        return criteriaComparisonData[criteriaA.id]?.[criteriaB.id] || 1;
      })
    );

    const criteriaConsistency = calculateConsistencyRatio(criteriaMatrix);
    newConsistencyRatios["criteria"] = criteriaConsistency;

    if (criteriaConsistency > 0.1) {
      newErrors[
        "criteria_consistency"
      ] = `Konsistensi kriteria tidak memenuhi syarat (${criteriaConsistency.toFixed(
        3
      )} > 0.1)`;
      hasErrors = true;
    }

    // Validate supplier comparisons for each criteria
    criteria.forEach((criterion) => {
      const supplierMatrix: number[][] = suppliers.map((supplierA) =>
        suppliers.map((supplierB) => {
          if (supplierA.id === supplierB.id) return 1;
          return (
            comparisonData[criterion.id]?.[supplierA.id]?.[supplierB.id] || 1
          );
        })
      );

      const supplierConsistency = calculateConsistencyRatio(supplierMatrix);
      newConsistencyRatios[`supplier_${criterion.id}`] = supplierConsistency;

      if (supplierConsistency > 0.1) {
        newErrors[
          `supplier_${criterion.id}_consistency`
        ] = `Konsistensi supplier untuk ${
          criterion.nama
        } tidak memenuhi syarat (${supplierConsistency.toFixed(3)} > 0.1)`;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setConsistencyRatios(newConsistencyRatios);
    return !hasErrors;
  }, [comparisonData, criteria, criteriaComparisonData, suppliers]);

  const handleCalculate = useCallback(async () => {
    if (!validateComparisons()) {
      toast.error("Perbaiki masalah konsistensi terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);

      const transformedCriteriaComparisons: ComparisonMatrix = {};

      for (const [criteriaAIdStr, comparisons] of Object.entries(
        criteriaComparisonData
      )) {
        const criteriaAId = criteriaAIdStr;
        transformedCriteriaComparisons[criteriaAId] = {};

        for (const [criteriaBIdStr, value] of Object.entries(comparisons)) {
          const criteriaBId = criteriaBIdStr;
          transformedCriteriaComparisons[criteriaAId][criteriaBId] =
            value as number;
        }
      }

      // Transform supplierComparisonData: number keys to string keys for suppliers
      const transformedSupplierComparisons: SupplierComparisons = {};

      for (const [criteriaIdStr, supplierComparisons] of Object.entries(
        comparisonData
      )) {
        const criteriaId = Number(criteriaIdStr);
        transformedSupplierComparisons[criteriaId] = {};

        // Type guard to ensure supplierComparisons is an object
        if (supplierComparisons && typeof supplierComparisons === "object") {
          for (const [supplierAIdStr, comparisons] of Object.entries(
            supplierComparisons
          )) {
            const supplierAId = supplierAIdStr; // Convert to string for API
            transformedSupplierComparisons[criteriaId][supplierAId] = {};

            // Type guard and assertion for comparisons
            if (
              comparisons &&
              typeof comparisons === "object" &&
              !Array.isArray(comparisons)
            ) {
              for (const [supplierBIdStr, value] of Object.entries(
                comparisons as Record<string, number>
              )) {
                const supplierBId = supplierBIdStr; // Convert to string for API
                transformedSupplierComparisons[criteriaId][supplierAId][
                  supplierBId
                ] = value;
              }
            }
          }
        }
      }

      // Prepare API payload
      const payload: GenerateRankingPayload = {
        nama_supply: selectedSupply,
        jumlah_kebutuhan: jumlahKebutuhan || 100,
        criteria_comparisons: transformedCriteriaComparisons,
        supplier_comparisons: transformedSupplierComparisons,
      };
      // Call API
      const response = await generateRanking(payload);
      if (response && response.data && Array.isArray(response.data.rankings)) {
        const transformedRankings = response.data.rankings.map((result) => {
          const supplier = suppliers.find((s) => s.id === result.supplierId);
          const supplierDetail = supplierDetails[result.supplierId];

          // Cari detail supply yang sesuai dengan selectedSupply
          const supplyDetail = supplierDetail?.find(
            (detail) => detail.nama_supply === selectedSupply
          );

          return {
            supplierId: result.supplierId,
            supplierName: result.supplierName,
            alamat: supplier?.alamat || "",
            score: result.score,
            ranking: result.ranking,
            jumlah_alokasi: 0,
            maksimal_produksi: supplyDetail?.maksimal_produksi || 0,
          };
        });

        const allocatedRankings = calculateAllocation(
          transformedRankings,
          jumlahKebutuhan
        );
        validateTotalCapacity(allocatedRankings, jumlahKebutuhan);
        setRankings(allocatedRankings);
        setShowRankingTable(true);
        setHasCalculated(true);
        console.log("Peler abu Abu: ", allocatedRankings);
        toast.success("Prioritas dan alokasi berhasil dihitung");
      } else {
        toast.error("Perhitungan gagal - tidak ada data ranking yang diterima");
      }
    } catch (error) {
      toast.error("Gagal menghitung prioritas");
      console.error("Calculate error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSupply,
    jumlahKebutuhan,
    criteriaComparisonData,
    comparisonData,
    validateComparisons,
    suppliers,
    supplierDetails,
  ]);

  const validateTotalCapacity = (
    rankings: AHPResult[],
    totalNeeds: number
  ): boolean => {
    const totalCapacity = rankings.reduce(
      (sum, item) => sum + item.maksimal_produksi,
      0
    );

    if (totalCapacity < totalNeeds) {
      toast.warning(
        `Total kapasitas maksimal supplier (${totalCapacity}) kurang dari kebutuhan (${totalNeeds})`
      );
      return false;
    }

    return true;
  };

  const calculateAllocation = (
    rankings: AHPResult[],
    totalNeeds: number
  ): AHPResult[] => {
    const sortedRankings = [...rankings].sort((a, b) => b.score - a.score);
    let remainingNeeds = totalNeeds;
    const allocationResults = sortedRankings.map((supplier) => {
      if (remainingNeeds <= 0) {
        return { ...supplier, jumlah_alokasi: 0 };
      }

      const maxAlokasi = Math.min(supplier.maksimal_produksi, remainingNeeds);
      remainingNeeds -= maxAlokasi;

      return {
        ...supplier,
        jumlah_alokasi: maxAlokasi,
      };
    });

    return allocationResults;
  };

  const getTotalPairwiseComparisons = (): number => {
    const criteriaComparisons = (criteria.length * (criteria.length - 1)) / 2;
    const supplierComparisons =
      criteria.length * ((suppliers.length * (suppliers.length - 1)) / 2);
    return criteriaComparisons + supplierComparisons;
  };

  const getCurrentProgress = (): number => {
    let completed = 0;
    const total = getTotalPairwiseComparisons();

    // Count criteria comparisons
    criteria.forEach((criteriaA) => {
      criteria.forEach((criteriaB) => {
        if (criteriaA.id < criteriaB.id) {
          const value = criteriaComparisonData[criteriaA.id]?.[criteriaB.id];
          if (value && value !== 1) completed++;
        }
      });
    });

    // Count supplier comparisons
    criteria.forEach((criterion) => {
      suppliers.forEach((supplierA) => {
        suppliers.forEach((supplierB) => {
          if (supplierA.id < supplierB.id) {
            const value =
              comparisonData[criterion.id]?.[supplierA.id]?.[supplierB.id];
            if (value && value !== 1) completed++;
          }
        });
      });
    });

    return Math.round((completed / total) * 100);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <div className="flex justify-center items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Analisis Perbandingan AHP - {selectedSupply || "Supply"}
              </h1>
            </div>
          </div>

          {/* Supply Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Informasi Kebutuhan & Pemesan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supply Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Supply *
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      isLoadingOptions
                        ? "Memuat data supply..."
                        : "Pilih atau ketik nama supply"
                    }
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    disabled={isLoadingOptions || showSupplierData}
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 pr-10 text-sm text-gray-900 dark:text-white shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {/* Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <Dropdown
                    isOpen={
                      isDropdownOpen && !isLoadingOptions && !showSupplierData
                    }
                    onClose={() => setIsDropdownOpen(false)}
                    className="w-full max-h-48 overflow-y-auto"
                  >
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => handleDropdownSelect(option)}
                          baseClassName="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
                        >
                          {option}
                        </DropdownItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm.trim() === ""
                          ? "Tidak ada data supply"
                          : "Tidak ada hasil yang ditemukan"}
                      </div>
                    )}
                  </Dropdown>
                </div>
              </div>

              {/* Jumlah Kebutuhan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah Kebutuhan *
                </label>
                <input
                  type="number"
                  value={jumlahKebutuhan || ""}
                  onChange={(e) => setJumlahKebutuhan(Number(e.target.value))}
                  disabled={showSupplierData}
                  className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 disabled:opacity-50"
                  placeholder="Contoh: 1000"
                  min="1"
                />
              </div>

              {/* Nama Pemesan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Pemesan *
                </label>
                <input
                  type="text"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  disabled={showSupplierData}
                  className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 disabled:opacity-50"
                  placeholder="Masukkan nama pemesan"
                />
              </div>

              {/* No Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Telepon *
                </label>
                <input
                  type="tel"
                  value={noTelpPemesan}
                  onChange={(e) => setNoTelpPemesan(e.target.value)}
                  disabled={showSupplierData}
                  className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 disabled:opacity-50"
                  placeholder="Masukkan no telepon"
                />
              </div>
            </div>

            {/* Catatan Validasi */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan Validasi
              </label>
              <textarea
                value={catatanValidasi}
                onChange={(e) => setCatatanValidasi(e.target.value)}
                disabled={showSupplierData}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 disabled:opacity-50"
                rows={3}
                placeholder="Tambahkan catatan validasi (opsional)"
              />
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end gap-4">
              {showSupplierData && (
                <button
                  onClick={() => {
                    setShowSupplierData(false);
                    setRankings([]);
                    setShowRankingTable(false);
                  }}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  Edit Data
                </button>
              )}

              <button
                onClick={handleSearchSupplier}
                disabled={!isFormValid || showSupplierData}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {showSupplierData ? "✓ Data Tersimpan" : "Cari Supplier"}
              </button>
            </div>

            {/* Form Validation Messages */}
            {!isFormValid && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Lengkapi data berikut:</strong>
                </p>
                <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside">
                  {!selectedSupply && <li>Pilih jenis supply</li>}
                  {!namaPemesan.trim() && <li>Nama pemesan</li>}
                  {!noTelpPemesan.trim() && <li>No telepon pemesan</li>}
                  {jumlahKebutuhan <= 0 && <li>Jumlah kebutuhan</li>}
                </ul>
              </div>
            )}
          </div>

          {showSupplierData && selectedSupply && (
            <>
              {/* Suppliers Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Supplier yang Menyediakan {selectedSupply || "Supply"}
                </h2>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Memuat data...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-bold text-black border-2 text-center text-theme-sm dark:text-gray-400"
                          >
                            No
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-bold text-black border-2 text-center text-theme-sm dark:text-gray-400"
                          >
                            Nama Supplier
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-bold text-black border-2 text-center text-theme-sm dark:text-gray-400"
                          >
                            Alamat
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-bold text-black border-2 text-center text-theme-sm dark:text-gray-400"
                          >
                            Maksimal Alokasi
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-bold text-black border-2 text-center text-theme-sm dark:text-gray-400"
                          >
                            Keterangan
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {suppliers.length > 0 ? (
                          suppliers.map((supplier, index) => {
                            const supplierDetail = supplierDetails[
                              supplier.id
                            ]?.find(
                              (detail) => detail.nama_supply === selectedSupply
                            );

                            return (
                              <TableRow key={supplier.id}>
                                <TableCell className="px-4 py-3 text-gray-800 border text-center text-theme-md dark:text-gray-400">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-800 border text-start text-theme-md dark:text-gray-400">
                                  {supplier.nama}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-800 border text-start text-theme-md dark:text-gray-400">
                                  {supplier.alamat}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-800 border text-center text-theme-md dark:text-gray-400">
                                  {supplierDetail ? (
                                    <span>
                                      {supplierDetail.maksimal_produksi}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 dark:text-gray-800 text-sm">
                                      Tidak tersedia
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 border text-start text-theme-md dark:text-gray-400">
                                  {supplier.keterangan}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="border border-gray-300 dark:border-gray-600 p-8 text-center text-gray-500 dark:text-gray-400"
                            >
                              {selectedSupply
                                ? `Tidak ada supplier yang menyediakan ${selectedSupply}`
                                : "Pilih jenis supply terlebih dahulu"}
                            </td>
                          </tr>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {selectedSupply && suppliers.length > 0 && (
                <>
                  {/* Progress Section */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Progress Perbandingan
                      </h1>
                      <div className="text-sm text-gray-600">
                        Progress: {getCurrentProgress()}% (
                        {getTotalPairwiseComparisons()} perbandingan total)
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCurrentProgress()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Criteria Comparison Section */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        1. Perbandingan Antar Kriteria
                      </h3>
                      {consistencyRatios["criteria"] !== undefined && (
                        <div
                          className={`text-sm px-3 py-1 rounded-full ${
                            consistencyRatios["criteria"] <= 0.1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          CR: {consistencyRatios["criteria"].toFixed(3)}
                          {consistencyRatios["criteria"] <= 0.1 ? " ✓" : " ✗"}
                        </div>
                      )}
                    </div>

                    {errors["criteria_consistency"] && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {errors["criteria_consistency"]}
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-3"></th>
                            {criteria.map((criterion) => (
                              <th
                                key={criterion.id}
                                className="border border-gray-300 p-3 text-center text-sm"
                              >
                                {criterion.nama}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {criteria.map((criteriaA) => (
                            <tr key={criteriaA.id}>
                              <td className="border border-gray-300 p-3 font-medium text-sm bg-gray-50">
                                {criteriaA.nama}
                              </td>
                              {criteria.map((criteriaB) => (
                                <td
                                  key={criteriaB.id}
                                  className="border border-gray-300 p-2"
                                >
                                  {criteriaA.id === criteriaB.id ? (
                                    <span className="text-center block font-semibold">
                                      1
                                    </span>
                                  ) : criteriaA.id < criteriaB.id ? (
                                    <select
                                      value={
                                        criteriaComparisonData[criteriaA.id]?.[
                                          criteriaB.id
                                        ] || 1
                                      }
                                      onChange={(e) =>
                                        handleCriteriaComparisonChange(
                                          criteriaA.id,
                                          criteriaB.id,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      {generateAHPDropdownOptions(
                                        criteriaA.nama,
                                        criteriaB.nama
                                      ).map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="text-center block text-sm text-gray-600">
                                      {criteriaComparisonData[criteriaB.id]?.[
                                        criteriaA.id
                                      ]
                                        ? getReciprocalValue(
                                            criteriaComparisonData[
                                              criteriaB.id
                                            ][criteriaA.id]
                                          )
                                        : "1.00"}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Supplier Comparison Section */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      2. Perbandingan Antar Supplier
                    </h3>

                    {/* Criteria Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b">
                      {criteria.map((criterion) => (
                        <button
                          key={criterion.id}
                          onClick={() => setSupplierTab(criterion.id)}
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            supplierTab === criterion.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {criterion.nama}
                          {consistencyRatios[`supplier_${criterion.id}`] !==
                            undefined && (
                            <span
                              className={`ml-2 text-xs ${
                                consistencyRatios[`supplier_${criterion.id}`] <=
                                0.1
                                  ? "text-green-200"
                                  : "text-red-200"
                              }`}
                            >
                              (
                              {consistencyRatios[
                                `supplier_${criterion.id}`
                              ].toFixed(2)}
                              )
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Current Tab Content */}
                    {criteria
                      .filter((c) => c.id === supplierTab)
                      .map((criterion) => (
                        <div key={criterion.id}>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-900">
                              Perbandingan Supplier berdasarkan {criterion.nama}
                            </h4>
                            {consistencyRatios[`supplier_${criterion.id}`] !==
                              undefined && (
                              <div
                                className={`text-sm px-3 py-1 rounded-full ${
                                  consistencyRatios[
                                    `supplier_${criterion.id}`
                                  ] <= 0.1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                CR:{" "}
                                {consistencyRatios[
                                  `supplier_${criterion.id}`
                                ].toFixed(3)}
                                {consistencyRatios[
                                  `supplier_${criterion.id}`
                                ] <= 0.1
                                  ? " ✓"
                                  : " ✗"}
                              </div>
                            )}
                          </div>

                          {errors[`supplier_${criterion.id}_consistency`] && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                              {errors[`supplier_${criterion.id}_consistency`]}
                            </div>
                          )}

                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 p-3"></th>
                                  {suppliers.map((supplier) => (
                                    <th
                                      key={supplier.id}
                                      className="border border-gray-300 p-3 text-center text-sm"
                                    >
                                      {supplier.nama}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {suppliers.map((supplierA) => (
                                  <tr key={supplierA.id}>
                                    <td className="border border-gray-300 p-3 font-medium text-sm bg-gray-50">
                                      {supplierA.nama}
                                    </td>
                                    {suppliers.map((supplierB) => (
                                      <td
                                        key={supplierB.id}
                                        className="border border-gray-300 p-2"
                                      >
                                        {supplierA.id === supplierB.id ? (
                                          <span className="text-center block font-semibold">
                                            1
                                          </span>
                                        ) : supplierA.id < supplierB.id ? (
                                          <Select
                                            value={String(
                                              comparisonData[criterion.id]?.[
                                                supplierA.id
                                              ]?.[supplierB.id] || 1
                                            )}
                                            onChange={(value) =>
                                              handleSupplierComparisonChange(
                                                criterion.id,
                                                supplierA.id,
                                                supplierB.id,
                                                Number(value)
                                              )
                                            }
                                            options={generateAHPDropdownOptions(
                                              supplierA.nama,
                                              supplierB.nama
                                            )}
                                            placeholder="Pilih preferensi"
                                            className="text-xs"
                                          />
                                        ) : (
                                          <span className="text-center block text-sm text-gray-600">
                                            {comparisonData[criterion.id]?.[
                                              supplierB.id
                                            ]?.[supplierA.id]
                                              ? getReciprocalValue(
                                                  comparisonData[criterion.id][
                                                    supplierB.id
                                                  ][supplierA.id]
                                                )
                                              : "1.00"}
                                          </span>
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Error Summary */}
                  {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-red-800 mb-2">
                        Masalah Konsistensi
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index} className="text-red-700">
                            {error}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-red-600 mt-2">
                        Pastikan semua perbandingan memiliki Consistency Ratio ≤
                        0.1 sebelum melanjutkan perhitungan.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCalculate}
                      disabled={isLoading}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Menghitung AHP...
                        </div>
                      ) : (
                        "Hitung Prioritas AHP"
                      )}
                    </button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">
                      Informasi AHP
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <p>
                          <strong>Total Perbandingan:</strong>{" "}
                          {getTotalPairwiseComparisons()}
                        </p>
                        <p>
                          <strong>Perbandingan Kriteria:</strong>{" "}
                          {(criteria.length * (criteria.length - 1)) / 2}
                        </p>
                        <p>
                          <strong>Perbandingan Supplier:</strong>{" "}
                          {criteria.length *
                            ((suppliers.length * (suppliers.length - 1)) / 2)}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Skala AHP:</strong> 1-9 (1=sama penting,
                          9=mutlak lebih penting)
                        </p>
                        <p>
                          <strong>Threshold CR:</strong> ≤ 0.1 (konsisten)
                        </p>
                        <p>
                          <strong>Auto Reciprocal:</strong> Jika A vs B = 3,
                          maka B vs A = 0.33
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ranking Table (Before Allocation) */}
                  {showRankingTable && rankings.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                          Hasil Ranking Supplier
                        </h3>
                        <button
                          onClick={handleCreateReport}
                          disabled={
                            isCreatingReport ||
                            isReportCreated ||
                            !namaPemesan.trim() ||
                            !noTelpPemesan.trim()
                          }
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                          {isReportCreated ? (
                            <Link
                              href="/staff/pelaporan"
                              className=" hover:text-underlined text-white rounded-lg font-medium flex items-center gap-2"
                            >
                              ✅ Lihat Laporan
                            </Link>
                          ) : isCreatingReport ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Membuat Laporan...
                            </>
                          ) : (
                            <>📄 Buat Laporan PDF</>
                          )}
                        </button>
                      </div>

                      <div className="overflow-x-auto mt-5">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-3 text-center">
                                Ranking
                              </th>
                              <th className="border border-gray-300 p-3 text-left">
                                Nama Supplier
                              </th>
                              <th className="border border-gray-300 p-3 text-left">
                                Alamat
                              </th>
                              <th className="border border-gray-300 p-3 text-center">
                                Score
                              </th>
                              <th className="border border-gray-300 p-3 text-center">
                                Jumlah Alokasi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rankings.map((result) => (
                              <tr
                                key={result.supplierId}
                                className={
                                  result.ranking === 1 ? "bg-yellow-50" : ""
                                }
                              >
                                <td className="border border-gray-300 p-3 text-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      result.ranking === 1
                                        ? "bg-yellow-100 text-yellow-800"
                                        : result.ranking === 2
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    #{result.ranking}
                                  </span>
                                </td>
                                <td className="border border-gray-300 p-3 font-medium">
                                  {result.supplierName}
                                </td>
                                <td className="border border-gray-300 p-3">
                                  {result.alamat}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {result.score}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {result.jumlah_alokasi}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
