"use client";
import React, { useRef, useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { SearchIcon, SearchDark } from "@/icons";
import { inputSupply } from "@/lib/api/supplyService";
import { getUniqueNamaSupply } from "@/lib/api/supplierService";
import { toast } from "sonner";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface InputSupplyStepProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (idCatatan: number) => void;
}

const InputSupplyStep: React.FC<InputSupplyStepProps> = ({
  isOpen,
  onClose,
  onNext,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [namaPemesan, setNamaPemesan] = useState("");
  const [noHp, setNoHp] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlahKebutuhan, setJumlahKebutuhan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for dropdown functionality
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [supplyOptions, setSupplyOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setNamaPemesan(user.username);
    }
  }, [user]);

  // Fetch supply options when component mounts
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

    if (isOpen) {
      fetchSupplyOptions();
    }
  }, [isOpen]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(supplyOptions);
    } else {
      const filtered = supplyOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, supplyOptions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isDropdownOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jumlah = parseInt(jumlahKebutuhan, 10);
    if (
      !namaPemesan.trim() ||
      !noHp.trim() ||
      !namaBarang.trim() ||
      isNaN(jumlah)
    ) {
      toast.warning("Pastikan semua field diisi dengan benar.");
      return;
    }

    if (!/^[0-9+\-\s()]+$/.test(noHp.trim())) {
      toast.warning("Nomor HP harus berupa angka yang valid.");
      return;
    }

    if (!user?.id) {
      toast.warning("User tidak terautentikasi. Silakan login kembali.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await inputSupply({
        nama_pemesan: namaPemesan.trim(),
        no_hp: noHp.trim(),
        nama_kebutuhan: namaBarang.trim(),
        jumlah_kebutuhan: jumlah,
        staff_id: user.id,
        tanggal: new Date().toISOString(),
      });

      toast.success("Kebutuhan berhasil ditambahkan!");
      setNamaPemesan(user?.username || "");
      setNoHp("");
      setNamaBarang("");
      setJumlahKebutuhan("");
      setSearchTerm("");
      onNext(response.catatan_supply_id);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message ||
            "Terjadi kesalahan saat menambahkan supply."
        );
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownSelect = (option: string) => {
    setNamaBarang(option);
    setSearchTerm(option);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNamaBarang(value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      {/* Backdrop/Overlay */}
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 p-5 md:p-6 flex flex-col items-center mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
            alt="Search Icon"
            width={30}
            height={30}
            className="size-10"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
          Step 1: Input Kebutuhan Supply
        </h3>

        <div className="mt-4 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto w-full max-w-md">
            <input
              type="text"
              placeholder="Nama Pemesan"
              value={namaPemesan}
              onChange={(e) => setNamaPemesan(e.target.value)}
              disabled={isLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <input
              type="tel"
              placeholder="No. HP"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              disabled={isLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* Dropdown Input for Nama Supply */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={isLoadingOptions ? "Memuat data supply..." : "Pilih atau ketik nama supply"}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                disabled={isLoading || isLoadingOptions}
                className="dropdown-toggle h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                isOpen={isDropdownOpen && !isLoadingOptions}
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
                    {searchTerm.trim() === "" ? "Tidak ada data supply" : "Tidak ada hasil yang ditemukan"}
                  </div>
                )}
              </Dropdown>
            </div>
            
            <input
              type="number"
              placeholder="Jumlah Kebutuhan"
              value={jumlahKebutuhan}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => setJumlahKebutuhan(e.target.value)}
              disabled={isLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <button
              type="submit"
              disabled={isLoading || isLoadingOptions}
              className="h-11 w-full rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                "Lanjut ke Langkah 2"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputSupplyStep;