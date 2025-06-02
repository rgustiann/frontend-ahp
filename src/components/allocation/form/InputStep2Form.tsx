"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { SearchIcon, SearchDark } from "@/icons";
import { getAllKriteria } from "@/lib/api/kriteriaService";
import Checkbox from "@/components/form/input/Checkbox";
import { Kriteria } from "@/types/kriteria";
import { toast } from "sonner";
import { SupplierRankingResponse, UsedCriteria } from "@/types/ranking";
import { generateRankingFromSupplyData } from "@/lib/api/reportService";

interface Step2FormCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: {
    rankings: SupplierRankingResponse[];
    supplyData: {
      nama_supply: string;
      jumlah_kebutuhan: number;
      nama_pemesan: string;
      no_telp_pemesan: string;
    };
    usedCriteria: UsedCriteria[];
    catatan_validasi: string;
  }) => void;
  supplyData?: {
    nama_supply: string;
    jumlah_kebutuhan: number;
    nama_pemesan: string;
    no_telp_pemesan: string;
  };
}

export const Step2FormCard: React.FC<Step2FormCardProps> = ({
  isOpen,
  onClose,
  onSuccess,
  supplyData,
}) => {
  const { theme } = useTheme();

  const [allCriteria, setAllCriteria] = useState<Kriteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<
    UsedCriteria[]
  >([]);
  const [catatanValidasi, setCatatanValidasi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCriteria, setIsLoadingCriteria] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingCriteria(true);
      getAllKriteria()
        .then(setAllCriteria)
        .finally(() => setIsLoadingCriteria(false));
      document.body.style.overflow = "hidden";
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const toggleCriteria = (nama: string, checked: boolean) => {
    if (checked) {
      setSelectedCriteria((prev) => [
        ...prev,
        { criteriaName: nama, criteriaValue: 0 },
      ]);
    } else {
      setSelectedCriteria((prev) =>
        prev.filter((c) => c.criteriaName !== nama)
      );
    }
  };

  const handleCriteriaValueChange = (nama: string, value: string) => {
    const numValue = Number(value);
    setSelectedCriteria((prev) =>
      prev.map((item) =>
        item.criteriaName === nama
          ? { ...item, criteriaValue: isNaN(numValue) ? 0 : numValue }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (selectedCriteria.length === 0) {
      toast.error("Pilih minimal satu kriteria.");
      return;
    }

    if (!supplyData) {
      toast.error("Data supply tidak tersedia.");
      return;
    }

    setIsLoading(true);
    try {
      // CHANGED: Only generate ranking, don't create report yet
      const rankingData = await generateRankingFromSupplyData({
        nama_supply: supplyData.nama_supply,
        jumlah_kebutuhan: supplyData.jumlah_kebutuhan,
        usedCriteria: selectedCriteria,
      });

      toast.success("Ranking berhasil di-generate!");

      // CHANGED: Pass all necessary data for later report creation
      onSuccess({
        rankings: rankingData.rankings,
        supplyData: supplyData,
        usedCriteria: selectedCriteria,
        catatan_validasi: catatanValidasi.trim(),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal generate ranking"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      {/* Modal content remains the same as original */}
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-5 md:p-6 flex flex-col items-center mx-4">
        {/* Close button and form content same as original */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image
            src={theme === "dark" ? SearchDark : SearchIcon}
            alt="Report Icon"
            width={30}
            height={30}
            className="size-10"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
          Step 2: Kriteria dan Validasi
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-4 w-full flex flex-col gap-4"
        >
          <textarea
            placeholder="Catatan Validasi"
            value={catatanValidasi}
            onChange={(e) => setCatatanValidasi(e.target.value)}
            disabled={isLoading}
            className="h-24 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="mt-8 space-y-4">
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                  Pilih Kriteria
                </h3>
                {isLoadingCriteria ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Memuat kriteria...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {allCriteria.map((k) => (
                      <Checkbox
                        key={k.id}
                        label={k.nama}
                        checked={selectedCriteria.some(
                          (c) => c.criteriaName === k.nama
                        )}
                        onChange={(checked) => toggleCriteria(k.nama, checked)}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {selectedCriteria.length > 0 && (
                <div className="border p-4 rounded-lg dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                    Masukkan Nilai Kriteria
                  </h3>
                  <div className="flex flex-col gap-3">
                    {selectedCriteria.map((item) => (
                      <div
                        key={item.criteriaName}
                        className="flex gap-2 items-center"
                      >
                        <label className="w-1/2 text-sm text-gray-700 dark:text-white">
                          {item.criteriaName}
                        </label>
                        <input
                          type="number"
                          placeholder="Nilai"
                          value={item.criteriaValue}
                          onChange={(e) =>
                            handleCriteriaValueChange(
                              item.criteriaName,
                              e.target.value
                            )
                          }
                          onFocus={(e) => {
                            if (e.target.value === "0") {
                              e.target.value = "";
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          disabled={isLoading}
                          className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLoadingCriteria}
            className="h-11 w-full rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generate Ranking...
              </>
            ) : (
              "Generate Ranking"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
