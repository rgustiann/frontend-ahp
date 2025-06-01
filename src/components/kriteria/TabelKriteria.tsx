"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";
import { useAuth } from "@/context/AuthContext";
import { Kriteria } from "@/types/kriteria";
import {
  getAllKriteria,
  createKriteria as createKriteriaAPI,
  updateKriteria as updateKriteriaAPI,
  deleteKriteria as deleteKriteriaAPI,
} from "@/lib/api/kriteriaService";
import { toast } from "sonner";

export default function TabelKriteria() {
  const { user } = useAuth();
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllKriteria();
        setKriteriaList(data);
      } catch (err) {
        console.error("Gagal mengambil data kriteria:", err);
        toast.error("Gagal mengambil data kriteria");
      }
    };
    fetchData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Kriteria>>({
    kode: "",
    nama: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // State untuk dialog konfirmasi hapus
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [kriteriaToDelete, setKriteriaToDelete] = useState<Kriteria | null>(null);

  const openModal = (data?: Kriteria) => {
    if (data) {
      setFormData(data);
      setIsEdit(true);
    } else {
      setFormData({
        kode: generateKode(),
        nama: "",
      });
      setIsEdit(false);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ kode: "", nama: "" });
  };

  const openDeleteDialog = (kriteria: Kriteria) => {
    setKriteriaToDelete(kriteria);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setKriteriaToDelete(null);
  };

  const createKriteria = async (data: Kriteria) => {
    try {
      const { kriteria_id } = await createKriteriaAPI({
        kode: data.kode,
        nama: data.nama,
      });
      const newData = { ...data, id: kriteria_id };
      setKriteriaList((prev) => [...prev, newData]);
      toast.success("Kriteria berhasil ditambahkan!", {
        description: `Kriteria ${data.nama} telah ditambahkan ke sistem`,
      });
    } catch (err) {
      console.error("❌ Gagal menambah kriteria:", err);
      toast.error("Gagal menambah kriteria", {
        description: "Terjadi kesalahan saat menambah kriteria baru",
      });
    }
  };

  const updateKriteria = async (data: Kriteria) => {
    try {
      await updateKriteriaAPI(data.id!, {
        kode: data.kode,
        nama: data.nama,
      });
      setKriteriaList((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
      toast.success("Kriteria berhasil diperbarui!", {
        description: `Perubahan pada kriteria ${data.nama} telah disimpan`,
      });
    } catch (err) {
      console.error("❌ Gagal memperbarui kriteria:", err);
      toast.error("Gagal memperbarui kriteria", {
        description: "Terjadi kesalahan saat menyimpan perubahan",
      });
    }
  };

  const deleteKriteria = async (id: number) => {
    try {
      await deleteKriteriaAPI(id);
      setKriteriaList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Kriteria berhasil dihapus!", {
        description: "Data kriteria telah dihapus dari sistem",
      });
      closeDeleteDialog();
    } catch (err) {
      console.error("❌ Gagal menghapus kriteria:", err);
      toast.error("Gagal menghapus kriteria", {
        description: "Terjadi kesalahan saat menghapus data",
      });
    }
  };

  const generateKode = () => {
    if (kriteriaList.length === 0) return "C1";
    const numbers = kriteriaList.map((k) => Number(k.kode.replace(/\D/g, "")));
    const maxNum = Math.max(...numbers);
    return `C${maxNum + 1}`;
  };

  const handleSave = async () => {
    if (!formData.nama?.trim() || !formData.kode?.trim()) {
      toast.error("Data tidak lengkap", {
        description: "Nama dan kode kriteria tidak boleh kosong",
      });
      return;
    }

    if (isEdit && formData.id != null) {
      await updateKriteria(formData as Kriteria); 
    } else {
      await createKriteria(formData as Kriteria); 
    }

    closeModal();
  };

  const handleConfirmDelete = async () => {
    if (kriteriaToDelete) {
      await deleteKriteria(kriteriaToDelete.id);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl dark:text-gray-300">Data Kriteria</h2>
        {user.role === "staff" && (
          <button
            onClick={() => openModal()}
            className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            + Tambah Kriteria
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl mt-8 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Kode Kriteria
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
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kriteriaList.map((k, index) => (
                <TableRow key={k.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-md dark:text-white/90">
                          {k.kode}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-md dark:text-white/90">
                          {k.nama}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "staff" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => openModal(k)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(k)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Input Kriteria */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-6">
        <h2 className="mb-4 font-semibold text-xl text-gray-800 dark:text-white/90">
          {isEdit ? "Edit Kriteria" : "Tambah Kriteria"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Kode
            </label>
            <input
              type="text"
              value={formData.kode}
              onChange={(e) =>
                setFormData({ ...formData, kode: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90"
              placeholder="Contoh: C4"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Nama Kriteria
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90"
              placeholder="Contoh: Harga"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="rounded px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            {isEdit ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </Modal>

      {/* Dialog Konfirmasi Hapus */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-99999" onClose={closeDeleteDialog}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800  p-6 text-left align-middle shadow-xl transition-all">
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
                      Apakah Anda yakin ingin menghapus kriteria{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {kriteriaToDelete?.nama}
                      </span>{" "}
                      dengan kode{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {kriteriaToDelete?.kode}
                      </span>
                      ? Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      onClick={closeDeleteDialog}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={handleConfirmDelete}
                    >
                      Hapus
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