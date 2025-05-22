"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  pertimbangan: string;
}

export default function TabelKriteria() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([
    {
      id: 1,
      kode: "C1",
      nama: "Harga",
      pertimbangan: "Semakin murah semakin baik",
    },
    {
      id: 2,
      kode: "C2",
      nama: "Kualitas",
      pertimbangan: "Barang harus tahan lama",
    },
    {
      id: 3,
      kode: "C3",
      nama: "Waktu Pengiriman",
      pertimbangan: "Pengiriman tepat waktu",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Kriteria>({
    id: 0,
    kode: "",
    nama: "",
    pertimbangan: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const openModal = (data?: Kriteria) => {
    if (data) {
      setFormData(data);
      setIsEdit(true);
    } else {
      setFormData({
        id: Date.now(),
        kode: `C${kriteriaList.length + 1}`,
        nama: "",
        pertimbangan: "",
      });
      setIsEdit(false);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ id: 0, kode: "", nama: "", pertimbangan: "" });
  };

  const handleSave = () => {
    if (!formData.nama.trim() || !formData.kode.trim()) {
      alert("Nama dan kode kriteria tidak boleh kosong.");
      return;
    }

    if (isEdit) {
      setKriteriaList((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item))
      );
    } else {
      setKriteriaList((prev) => [...prev, formData]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus kriteria ini?")) {
      setKriteriaList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl dark:text-gray-300">Data Kriteria</h2>
        <button
          onClick={() => openModal()}
          className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700"
        >
          + Tambah Kriteria
        </button>
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
                  Pertimbangan
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
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                    {k.pertimbangan}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModal(k)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Hapus
                      </button>
                    </div>
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
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Pertimbangan
            </label>
            <textarea
              value={formData.pertimbangan}
              onChange={(e) =>
                setFormData({ ...formData, pertimbangan: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90"
              placeholder="Contoh: Semakin murah semakin baik"
              rows={3}
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
    </div>
  );
}
