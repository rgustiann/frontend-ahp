"use client";
import React, { ReactNode, Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Eye, X } from "lucide-react";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";
import PhoneInput from "../form/group-input/PhoneInput";
import {
  Supplier,
  SupplierDetail,
  NilaiKriteriaSupplier,
} from "@/types/supplier";
import { Kriteria } from "@/types/kriteria";
import { useAuth } from "@/context/AuthContext";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
  getNilaiKriteriaBySupplier,
  addNilaiKriteria,
  updateNilaiKriteria,
  deleteNilaiKriteria,
  // Add new API functions for supplier details
  getSuppliesBySupplier,
  addSupplyToSupplier,
  updateSupply,
  deleteSupply,
} from "@/lib/api/supplierService";
import { getAllKriteria } from "@/lib/api/kriteriaService";

interface SupplierFormData extends Supplier {
  supplierDetails: SupplierDetail[];
  nilaiKriteria: NilaiKriteriaSupplier[];
}

interface NilaiKriteriaDetail {
  id?: number;
  kriteriaId: number;
  namaKriteria: string;
  nilai: number | undefined;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const ModalTooltip = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-10 flex items-center justify-center z-99999">
      <div className="bg-white border border-gray-400 p-2 dark:bg-gray-800 rounded-lg max-w-sm w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
};
export default function TabelSupplier() {
  const { user } = useAuth();
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [supplierDetails, setSupplierDetails] = useState<
    Record<number, SupplierDetail[]>
  >({});
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [supplierNilaiKriteria, setSupplierNilaiKriteria] = useState<
    Record<number, NilaiKriteriaDetail[]>
  >({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    id: 0,
    nama: "",
    alamat: "",
    contact: "",
    keterangan: "",
    supplierDetails: [],
    nilaiKriteria: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const openSupplyModal = (supplier: Supplier) => {
    const details = supplierDetails[supplier.id] || [];
    setModalTitle(`Supply Details - ${supplier.nama}`);
    setModalContent(
      <div className="space-y-3">
        {details.length > 0 ? (
          details.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-50 flex flex-row justify-between w-full dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
            >
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {detail.nama_supply}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center px-2 py-1 bg-blue-200 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 rounded text-sm">
                  Max: {detail.maksimal_produksi}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Tidak ada data supply
          </div>
        )}
      </div>
    );
    setIsModalOpen(true);
  };

  const openKriteriaModal = (supplier: Supplier) => {
    const nilaiKriteria = supplierNilaiKriteria[supplier.id] || [];
    const avgScore =
      nilaiKriteria.length > 0
        ? Math.round(
            nilaiKriteria.reduce((sum, nk) => sum + (nk?.nilai ?? 0), 0) /
              nilaiKriteria.length
          )
        : 0;

    setModalTitle(`Kriteria Penilaian - ${supplier.nama}`);
    setModalContent(
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {avgScore}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Rata-rata Skor
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {kriteriaList.map((kriteria) => {
            const nilai = nilaiKriteria.find(
              (nk) => nk.kriteriaId === kriteria.id
            );
            const score = nilai ? nilai.nilai : 0;
            const percentage = ((score ?? 0) / 100) * 100;
            return (
              <div
                key={kriteria.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {kriteria.nama}
                  </span>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const renderSupplyDetails = (supplier: Supplier) => {
    const details = supplierDetails[supplier.id] || [];

    if (details.length === 0) {
      return <span className="text-gray-400">-</span>;
    }

    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {details.length} items
        </span>

        <button
          onClick={() => openSupplyModal(supplier)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          title="Lihat detail lengkap"
        >
          <Eye size={16} />
        </button>
      </div>
    );
  };

  // 8. Tambahkan function untuk render Kriteria dengan tooltip
  const renderKriteria = (supplier: Supplier) => {
    const nilaiKriteria = supplierNilaiKriteria[supplier.id] || [];
    if (nilaiKriteria.length === 0) {
      return <span className="text-gray-400">-</span>;
    }

    const avgScore = Math.round(
      nilaiKriteria.reduce((sum, nk) => sum + (nk.nilai ?? 0), 0) /
        nilaiKriteria.length
    );

    // Warna berdasarkan skor
    const getScoreColor = (score: number) => {
      if (score >= 8) return "text-green-600 dark:text-green-400";
      if (score >= 7) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    };

    return (
      <div className="flex items-center gap-4">
        <span className={`text-sm font-medium ${getScoreColor(avgScore)}`}>
          Avg: {avgScore}
        </span>

        <button
          onClick={() => openKriteriaModal(supplier)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          title="Lihat detail penilaian"
        >
          <Eye size={16} />
        </button>
      </div>
    );
  };
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(1);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [suppliers, kriteria] = await Promise.all([
        getAllSuppliers(),
        getAllKriteria(),
      ]);

      console.log(
        "Data loaded - Suppliers:",
        suppliers.length,
        "Kriteria:",
        kriteria.length
      );
      setSupplierList(suppliers);
      setKriteriaList(kriteria);

      // Fetch supplier details
      const supplierDetailsMap: Record<number, SupplierDetail[]> = {};
      const nilaiKriteriaMap: Record<number, NilaiKriteriaDetail[]> = {};

      for (const supplier of suppliers) {
        try {
          // Fetch supplier details
          const details = await getSuppliesBySupplier(supplier.id);
          supplierDetailsMap[supplier.id] = details;
          // Fetch nilai kriteria
          const nilaiKriteria = await getNilaiKriteriaBySupplier(supplier.id);
          nilaiKriteriaMap[supplier.id] = nilaiKriteria.map((nk) => ({
            id: nk.id,
            kriteriaId:
              kriteria.find((k) => k.nama === nk.namaKriteria)?.id || 0,
            namaKriteria: nk.namaKriteria,
            nilai: nk.nilai,
          }));
        } catch (error) {
          console.warn(
            `Gagal mengambil data untuk supplier ${supplier.nama}:`,
            error
          );
          supplierDetailsMap[supplier.id] = [];
          nilaiKriteriaMap[supplier.id] = [];
        }
      }

      setSupplierDetails(supplierDetailsMap);
      setSupplierNilaiKriteria(nilaiKriteriaMap);
      console.log(
        "Data loaded:",
        Object.keys(supplierDetailsMap).length,
        "suppliers with details"
      );
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      toast.error("Gagal memuat data", {
        description: "Silakan refresh halaman atau coba lagi nanti",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (supplier?: Supplier) => {
    setCurrentStep(1);
    if (supplier) {
      console.log("Opening edit modal for:", supplier.nama);

      const existingDetails = supplierDetails[supplier.id] || [];
      const existingNilai = supplierNilaiKriteria[supplier.id] || [];
      console.log("Existing supplier details:", existingDetails);
      console.log("Existing nilai kriteria:", existingNilai);

      const formNilaiKriteria: NilaiKriteriaSupplier[] = kriteriaList.map(
        (kriteria) => {
          const existing = existingNilai.find(
            (nk) => nk.kriteriaId === kriteria.id
          );
          return {
            kriteriaId: kriteria.id,
            nilai: existing?.nilai || 0,
          };
        }
      );

      setFormData({
        ...supplier,
        supplierDetails:
          existingDetails.length > 0
            ? existingDetails
            : [
                {
                  id: 0,
                  supplier_id: supplier.id,
                  nama_supply: "",
                  maksimal_produksi: 0,
                },
              ],
        nilaiKriteria: formNilaiKriteria,
      });
      setIsEdit(true);
    } else {
      console.log("Opening create modal");

      const emptyNilaiKriteria: NilaiKriteriaSupplier[] = kriteriaList.map(
        (kriteria) => ({
          kriteriaId: kriteria.id,
          nilai: 0,
        })
      );

      setFormData({
        id: 0,
        nama: "",
        alamat: "",
        contact: "",
        keterangan: "",
        supplierDetails: [
          { id: 0, supplier_id: 0, nama_supply: "", maksimal_produksi: 0 },
        ],
        nilaiKriteria: emptyNilaiKriteria,
      });
      setIsEdit(false);
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetSteps();
    setCurrentStep(1);
    setFormData({
      id: 0,
      nama: "",
      alamat: "",
      contact: "",
      keterangan: "",
      supplierDetails: [],
      nilaiKriteria: [],
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.nama.trim() !== "" && formData.alamat.trim() !== "";
      case 2:
        return formData.supplierDetails.some(
          (detail) => detail.nama_supply.trim() !== ""
        );
      case 3:
        return true; // Kriteria bisa kosong
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= step
                ? "bg-brand-600 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {step}
          </div>
          <div className="ml-2 text-sm font-medium">
            {step === 1 && "Info Dasar"}
            {step === 2 && "Detail Supply"}
            {step === 3 && "Penilaian"}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 ml-4 ${
                currentStep > step
                  ? "bg-brand-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let supplierId: number;

      const supplierData: Supplier = {
        id: formData.id,
        nama: formData.nama,
        alamat: formData.alamat,
        contact: formData.contact,
        keterangan: formData.keterangan,
      };

      console.log("Saving supplier:", supplierData);

      if (isEdit) {
        await updateSupplier(formData.id, supplierData);
        supplierId = formData.id;
        console.log("Supplier updated:", supplierId);
      } else {
        const res = await createSupplier(supplierData);
        supplierId = res.supplier_id;
        console.log("Supplier created:", supplierId);
      }

      // Handle supplier details
      await handleSupplierDetails(supplierId, formData.supplierDetails);

      // Handle nilai kriteria
      await handleNilaiKriteria(supplierId, formData.nilaiKriteria);

      await fetchData();
      closeModal();

      if (isEdit) {
        toast.success("Supplier berhasil diperbarui!", {
          description: `Perubahan pada supplier ${formData.nama} telah disimpan`,
        });
      } else {
        toast.success("Supplier berhasil ditambahkan!", {
          description: `Supplier ${formData.nama} telah ditambahkan ke sistem`,
        });
      }

      console.log("Save completed successfully");
    } catch (error) {
      console.error("Gagal menyimpan supplier:", error);
      toast.error("Gagal menyimpan data supplier", {
        description: "Silakan coba lagi nanti",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierDetails = async (
    supplierId: number,
    detailsList: SupplierDetail[]
  ) => {
    try {
      console.log("Processing supplier details for supplier:", supplierId);
      console.log("Form details data:", detailsList);

      if (isEdit) {
        const existingDetails = supplierDetails[supplierId] || [];
        console.log("Existing supplier details:", existingDetails);

        // Update or create new details
        for (const detail of detailsList) {
          if (detail.id && detail.id > 0) {
            // Update existing detail
            await updateSupply(detail.id, {
              nama_supply: detail.nama_supply,
              maksimal_produksi: detail.maksimal_produksi,
            });
            console.log("Updated detail:", detail.nama_supply);
          } else {
            // Create new detail
            await addSupplyToSupplier(supplierId, {
              nama_supply: detail.nama_supply,
              maksimal_produksi: detail.maksimal_produksi,
            });
            console.log("Created new detail:", detail.nama_supply);
          }
        }

        // Delete removed details
        for (const existing of existingDetails) {
          const stillExists = detailsList.find((d) => d.id === existing.id);
          if (!stillExists) {
            await deleteSupply(existing.id);
            console.log("Deleted detail:", existing.nama_supply);
          }
        }
      } else {
        // Create all new details
        console.log("Creating new supplier details");
        for (const detail of detailsList) {
          if (detail.nama_supply.trim()) {
            await addSupplyToSupplier(supplierId, {
              nama_supply: detail.nama_supply,
              maksimal_produksi: detail.maksimal_produksi,
            });
            console.log("Created detail:", detail.nama_supply);
          }
        }
      }

      console.log("Supplier details processing completed");
    } catch (error) {
      console.error("Gagal menyimpan supplier details:", error);
      throw error;
    }
  };

  const handleNilaiKriteria = async (
    supplierId: number,
    nilaiKriteriaList: NilaiKriteriaSupplier[]
  ) => {
    try {
      console.log("Processing nilai kriteria for supplier:", supplierId);
      console.log("Form data:", nilaiKriteriaList);

      if (isEdit) {
        const existingNilai = supplierNilaiKriteria[supplierId] || [];
        console.log("Existing nilai kriteria:", existingNilai);

        for (const nilaiItem of nilaiKriteriaList) {
          const kriteria = kriteriaList.find(
            (k) => k.id === nilaiItem.kriteriaId
          );
          if (!kriteria) {
            console.warn("Kriteria not found:", nilaiItem.kriteriaId);
            continue;
          }

          const existing = existingNilai.find(
            (nk) => nk.kriteriaId === nilaiItem.kriteriaId
          );

          if (existing && existing.id) {
            if (existing.nilai !== nilaiItem.nilai) {
              console.log(
                `UPDATE: ${kriteria.nama} from ${existing.nilai} to ${nilaiItem.nilai}`
              );
              await updateNilaiKriteria(existing.id, {
                namaKriteria: kriteria.nama,
                nilai: nilaiItem.nilai,
              });
            } else {
              console.log(
                `SKIP: ${kriteria.nama} unchanged (${nilaiItem.nilai})`
              );
            }
          } else {
            if (nilaiItem.nilai > 0) {
              console.log(`CREATE: ${kriteria.nama} = ${nilaiItem.nilai}`);
              await addNilaiKriteria(supplierId, {
                namaKriteria: kriteria.nama,
                nilai: nilaiItem.nilai,
              });
            } else {
              console.log(`SKIP CREATE: ${kriteria.nama} = 0`);
            }
          }
        }

        for (const existing of existingNilai) {
          const stillExists = nilaiKriteriaList.find(
            (nk) => nk.kriteriaId === existing.kriteriaId
          );
          if (!stillExists && existing.id) {
            console.log(
              `DELETE: Kriteria ${existing.namaKriteria} removed from master`
            );
            await deleteNilaiKriteria(existing.id);
          }
        }
      } else {
        console.log("Creating new nilai kriteria entries");

        for (const nilaiItem of nilaiKriteriaList) {
          if (nilaiItem.nilai > 0) {
            const kriteria = kriteriaList.find(
              (k) => k.id === nilaiItem.kriteriaId
            );
            if (kriteria) {
              try {
                console.log(`CREATE: ${kriteria.nama} = ${nilaiItem.nilai}`);
                await addNilaiKriteria(supplierId, {
                  namaKriteria: kriteria.nama,
                  nilai: nilaiItem.nilai,
                });
              } catch (error) {
                console.warn(
                  `Gagal menyimpan kriteria ${kriteria.nama}:`,
                  error
                );
              }
            }
          } else {
            console.log(`SKIP: ${nilaiItem.kriteriaId} = 0`);
          }
        }
      }

      console.log("Nilai kriteria processing completed");
    } catch (error) {
      console.error("Gagal menyimpan nilai kriteria:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const supplier = supplierList.find((s) => s.id === id);
      console.log("Deleting supplier:", supplier?.nama);

      // Delete supplier details first
      const details = supplierDetails[id] || [];
      console.log("Deleting", details.length, "supplier detail entries");
      for (const detail of details) {
        try {
          await await deleteSupply(detail.id);
          console.log("Deleted supplier detail:", detail.nama_supply);
        } catch (error) {
          console.warn(
            `Gagal menghapus supplier detail ${detail.nama_supply}:`,
            error
          );
        }
      }

      // Delete nilai kriteria
      const nilaiKriteria = supplierNilaiKriteria[id] || [];
      console.log("Deleting", nilaiKriteria.length, "nilai kriteria entries");
      for (const nilai of nilaiKriteria) {
        if (nilai.id) {
          try {
            await deleteNilaiKriteria(nilai.id);
            console.log("Deleted nilai kriteria:", nilai.namaKriteria);
          } catch (error) {
            console.warn(
              `Gagal menghapus nilai kriteria ${nilai.namaKriteria}:`,
              error
            );
          }
        }
      }

      // Finally delete the supplier
      await deleteSupplier(id);
      console.log("Supplier deleted successfully");

      await fetchData();
      closeDeleteDialog();
      toast.success("Supplier berhasil dihapus!", {
        description: `Data supplier ${
          supplier?.nama || `ID ${id}`
        } telah dihapus dari sistem`,
      });
    } catch (error) {
      console.error("Gagal menghapus supplier:", error);
      toast.error("Gagal menghapus supplier", {
        description: "Terjadi kesalahan saat menghapus data supplier",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Supplier, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSupplierDetailChange = (
    index: number,
    field: keyof SupplierDetail,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      supplierDetails: prev.supplierDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  const addSupplierDetail = () => {
    setFormData((prev) => ({
      ...prev,
      supplierDetails: [
        ...prev.supplierDetails,
        {
          id: 0,
          supplier_id: prev.id,
          nama_supply: "",
          maksimal_produksi: 0,
        },
      ],
    }));
  };

  const removeSupplierDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      supplierDetails: prev.supplierDetails.filter((_, i) => i !== index),
    }));
  };

  const handleNilaiKriteriaChange = (kriteriaId: number, nilai: number) => {
    setFormData((prev) => ({
      ...prev,
      nilaiKriteria: prev.nilaiKriteria.map((item) =>
        item.kriteriaId === kriteriaId ? { ...item, nilai } : item
      ),
    }));
  };

  const openDeleteDialog = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (supplierToDelete) {
      await handleDelete(supplierToDelete.id);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl dark:text-gray-300">Data Supplier</h2>
        {user.role === "staff" && (
          <button
            onClick={() => openModal()}
            disabled={isLoading}
            className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "+ Tambah Supplier"}
          </button>
        )}
      </div>

      <div className="overflow-hidden h-full rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Nama
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Alamat
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Supply Details
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Kriteria
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Keterangan
                  </TableCell>
                  {user.role === "staff" && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell className="col-span-full px-5 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : supplierList.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 col-span-full">
                      Tidak ada data supplier
                    </TableCell>
                  </TableRow>
                ) : (
                  supplierList.map((supplier) => {
                    return (
                      <TableRow key={supplier.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-md dark:text-white/90">
                                {supplier.nama}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                          {supplier.alamat}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                          {supplier.contact}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {renderSupplyDetails(supplier)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {renderKriteria(supplier)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                          {supplier.keterangan}
                        </TableCell>
                        {user.role === "staff" && (
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-md dark:text-gray-400">
                            <div className="flex gap-4">
                              <button
                                onClick={() => openModal(supplier)}
                                disabled={isLoading}
                                className="text-blue-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteDialog(supplier)}
                                disabled={isLoading}
                                className="text-red-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Hapus
                              </button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ModalTooltip
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </ModalTooltip>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="w-full max-w-[800px] mx-auto p-6 lg:p-10"
      >
        <h2 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
          {isEdit ? "Edit Supplier" : "Tambah Supplier"}
        </h2>
        <div className="min-h-[400px]">
          <StepIndicator />

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informasi Dasar Supplier
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Nama Supplier
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Supplier"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    className="dark:bg-dark-900 mb-2 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Alamat
                  </label>
                  <input
                    type="text"
                    placeholder="Lokasi Supplier"
                    value={formData.alamat}
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                    className="dark:bg-dark-900 mb-2 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Contact Supplier
                </label>
                <PhoneInput
                  countries={[
                    { code: "US", label: "+1" },
                    { code: "ID", label: "+62" },
                    { code: "MY", label: "+60" },
                    { code: "SG", label: "+65" },
                    { code: "PH", label: "+63" },
                  ]}
                  value={formData.contact}
                  placeholder="Enter phone number"
                  onChange={(phone) => handleInputChange("contact", phone)}
                  selectPosition="start"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Keterangan
                </label>
                <textarea
                  placeholder="Keterangan tambahan"
                  value={formData.keterangan}
                  onChange={(e) =>
                    handleInputChange("keterangan", e.target.value)
                  }
                  rows={3}
                  className="dark:bg-dark-900 mb-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          )}

          {/* Step 2: Supplier Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detail Supply
                </h3>
                <button
                  type="button"
                  onClick={addSupplierDetail}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
                >
                  <PlusIcon className="w-3 h-3" />
                  Tambah Item
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.supplierDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Item #{index + 1}
                      </span>
                      {formData.supplierDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSupplierDetail(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Nama Supply
                        </label>
                        <input
                          type="text"
                          placeholder="Nama barang yang disupply"
                          value={detail.nama_supply}
                          onChange={(e) =>
                            handleSupplierDetailChange(
                              index,
                              "nama_supply",
                              e.target.value
                            )
                          }
                          className="w-full h-9 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Maksimal Produksi
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={detail.maksimal_produksi || ""}
                          onChange={(e) =>
                            handleSupplierDetailChange(
                              index,
                              "maksimal_produksi",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full h-9 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Nilai Kriteria */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Penilaian Kriteria
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {kriteriaList.map((kriteria) => {
                  const nilaiItem = formData.nilaiKriteria.find(
                    (item) => item.kriteriaId === kriteria.id
                  );
                  return (
                    <div
                      key={kriteria.id}
                      className="p-3 border border-gray-200 rounded-lg dark:border-gray-700"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {kriteria.nama}
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={nilaiItem?.nilai || ""}
                        onChange={(e) =>
                          handleNilaiKriteriaChange(
                            kriteria.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full h-9 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeModal}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={isLoading || !validateStep(currentStep)}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isLoading || !formData.nama.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Transition.Root show={isDeleteDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-999999" onClose={closeDeleteDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Hapus Supplier
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Apakah Anda yakin ingin menghapus supplier{" "}
                          <strong>{supplierToDelete?.nama}</strong>? Tindakan
                          ini akan menghapus semua data terkait termasuk detail
                          supply dan nilai kriteria. Tindakan ini tidak dapat
                          dibatalkan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? "Menghapus..." : "Hapus"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={closeDeleteDialog}
                      disabled={isLoading}
                    >
                      Batal
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
