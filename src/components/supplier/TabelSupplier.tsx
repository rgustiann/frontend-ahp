"use client";
import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
import ComponentCard from "../common/ComponentCard";
import { Supplier, NilaiKriteriaSupplier } from "@/types/supplier";
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
} from "@/lib/api/supplierService";
import { getAllKriteria } from "@/lib/api/kriteriaService";

interface SupplierFormData extends Supplier {
  nilaiKriteria: NilaiKriteriaSupplier[];
}

interface NilaiKriteriaDetail {
  id?: number;
  kriteriaId: number;
  namaKriteria: string;
  nilai: number | undefined;
}

export default function TabelSupplier() {
  const { user } = useAuth();

  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
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
    nama_supply: "",
    maksimal_produksi: 0,
    keterangan: "",
    nilaiKriteria: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      const nilaiKriteriaMap: Record<number, NilaiKriteriaDetail[]> = {};

      for (const supplier of suppliers) {
        try {
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
            `Gagal mengambil nilai kriteria untuk supplier ${supplier.nama}:`,
            error
          );
          nilaiKriteriaMap[supplier.id] = [];
        }
      }

      setSupplierNilaiKriteria(nilaiKriteriaMap);
      console.log(
        "Nilai kriteria loaded:",
        Object.keys(nilaiKriteriaMap).length,
        "suppliers"
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
    if (supplier) {
      console.log("Opening edit modal for:", supplier.nama);

      const existingNilai = supplierNilaiKriteria[supplier.id] || [];
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
        nama_supply: "",
        maksimal_produksi: 0,
        keterangan: "",
        nilaiKriteria: emptyNilaiKriteria,
      });
      setIsEdit(false);
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      id: 0,
      nama: "",
      alamat: "",
      contact: "",
      nama_supply: "",
      maksimal_produksi: 0,
      keterangan: "",
      nilaiKriteria: [],
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let supplierId: number;

      const supplierData: Supplier = {
        id: formData.id,
        nama: formData.nama,
        alamat: formData.alamat,
        contact: formData.contact,
        nama_supply: formData.nama_supply,
        maksimal_produksi: Number(formData.maksimal_produksi),
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

      console.log("Save completed successfully");
    } catch (error) {
      console.error("Gagal menyimpan supplier:", error);
      alert("Gagal menyimpan data supplier. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
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

      <div className="overflow-hidden rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                    Supply
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Maksimal Produksi
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
                    <TableCell className="col- px-5 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : supplierList.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500">
                      Tidak ada data supplier
                    </TableCell>
                  </TableRow>
                ) : (
                  supplierList.map((supplier) => {
                    const nilaiKriteria =
                      supplierNilaiKriteria[supplier.id] || [];
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
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                          {supplier.nama_supply}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                          {supplier.maksimal_produksi}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="space-y-1">
                            {kriteriaList.map((kriteria) => {
                              const nilai = nilaiKriteria.find(
                                (nk) => nk.kriteriaId === kriteria.id
                              );
                              return (
                                <div key={kriteria.id}>
                                  <span className="font-medium">
                                    {kriteria.nama}:
                                  </span>{" "}
                                  {nilai ? nilai.nilai : "-"}
                                </div>
                              );
                            })}
                          </div>
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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[1000px] p-6 lg:p-10"
      >
        <h2 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
          {isEdit ? "Edit Supplier" : "Tambah Supplier"}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="mt-8 space-y-4">
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
                onChange={(e) => handleInputChange("alamat", e.target.value)}
                className="dark:bg-dark-900 mb-2 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
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
                Nama Supply
              </label>
              <input
                type="text"
                placeholder="Barang Yang dipasokkan"
                value={formData.nama_supply}
                onChange={(e) =>
                  handleInputChange("nama_supply", e.target.value)
                }
                className="dark:bg-dark-900 mb-2 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">
                Maksimal Produksi
              </label>
              <input
                type="number"
                min="0"
                value={formData.maksimal_produksi}
                onChange={(e) =>
                  handleInputChange("maksimal_produksi", e.target.value)
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    handleInputChange("maksimal_produksi", "");
                  }
                }}
                onWheel={(e) => e.currentTarget.blur()}
                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Keterangan
              </label>
              <input
                placeholder="Keterangan tambahan"
                value={formData.keterangan}
                onChange={(e) =>
                  handleInputChange("keterangan", e.target.value)
                }
                className="dark:bg-dark-900 mb-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          {/* Kolom Kanan - Input Kriteria */}
          <div className="space-y-4 mt-8">
            <ComponentCard title="Input Kriteria">
              <div className="space-y-3 max-h-full overflow-y-auto custom-scrollbar pr-2">
                {kriteriaList.map((kriteria) => {
                  const nilaiKriteria = formData.nilaiKriteria.find(
                    (item) => item.kriteriaId === kriteria.id
                  );
                  return (
                    <div key={kriteria.id}>
                      <label className="block font-medium mb-1 text-sm">
                        {kriteria.nama} ({kriteria.kode})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          nilaiKriteria?.nilai !== undefined
                            ? nilaiKriteria.nilai
                            : ""
                        }
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            handleNilaiKriteriaChange(kriteria.id, 0);
                          }
                        }}
                        onChange={(e) => {
                          const nilai = parseFloat(e.target.value) || 0;
                          handleNilaiKriteriaChange(kriteria.id, nilai);
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10"
                        placeholder="0"
                      />
                    </div>
                  );
                })}
              </div>
            </ComponentCard>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="rounded px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Menyimpan..."
              : isEdit
              ? "Simpan Perubahan"
              : "Tambah"}
          </button>
        </div>
      </Modal>
      {/* Dialog Konfirmasi Hapus */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-99999"
          onClose={closeDeleteDialog}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Konfirmasi Hapus
                    </Dialog.Title>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Apakah Anda yakin ingin menghapus supplier{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {supplierToDelete?.nama}
                      </span>
                      ? Semua nilai kriteria yang terkait juga akan dihapus.
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      onClick={closeDeleteDialog}
                      disabled={isLoading}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
