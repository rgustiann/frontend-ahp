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
import PhoneInput from "../form/group-input/PhoneInput";
import ComponentCard from "../common/ComponentCard";
import { Supplier } from "@/types/supplier";
import { Kriteria } from "@/types/kriteria";
// import { getKriteriaList } from "@/lib/api/kriteriaService";
import { useAuth } from "@/context/AuthContext";

const dummyKriteria: Kriteria[] = [
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
];

const dummySuppliers: Supplier[] = [
  {
    id: 1,
    nama: "PT. Baja Jaya",
    alamat: "Jl. Merdeka No.10, Jakarta",
    contact: "0812-3456-7890",
    nilaiKriteria: [
      { kriteriaId: 1, nilai: 80 },
      { kriteriaId: 2, nilai: 70 },
      { kriteriaId: 3, nilai: 90 },
    ],
    keterangan: "Supplier utama untuk baja ringan",
  },
  {
    id: 2,
    nama: "CV. Karya Logam",
    alamat: "Jl. Industri No.22, Surabaya",
    contact: "0821-7654-3210",
    nilaiKriteria: [
      { kriteriaId: 1, nilai: 80 },
      { kriteriaId: 2, nilai: 70 },
      { kriteriaId: 3, nilai: 90 },
    ],
    keterangan: "Pengiriman cepat, harga kompetitif",
  },
];

export default function TabelSupplier() {
  const { user } = useAuth();
  // const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [orders, setOrders] = useState<Supplier[]>(dummySuppliers);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Supplier>({
    id: 0,
    nama: "",
    alamat: "",
    contact: "",
    nilaiKriteria: [],
    keterangan: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // useEffect(() => {
  //   async function fetchKriteria() {
  //     try {
  //       const data = await getKriteriaList();
  //       setKriteriaList(data);
  //     } catch (error) {
  //       console.error("Gagal load data kriteria:", error);
  //     }
  //   }
  //   fetchKriteria();
  // }, []);

  // function getNilaiSupplierByKriteria(
  //   supplier: Supplier,
  //   kriteriaId: number
  // ): number | string {
  //   const nilaiObj = supplier.nilaiKriteria.find(
  //     (nk) => nk.kriteriaId === kriteriaId
  //   );
  //   return nilaiObj ? nilaiObj.nilai : "-";
  // }

  const openModal = (data?: Supplier) => {
    if (data) {
      setFormData(data);
      setIsEdit(true);
    } else {
      setFormData({
        id: Date.now(),
        nama: "",
        alamat: "",
        contact: "",
        nilaiKriteria: [],
        keterangan: "",
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
      nilaiKriteria: [],
      keterangan: "",
    });
  };

  const handleSave = () => {
    const nilaiKriteriaStr = Object.entries(formData.nilaiKriteria)
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join("\n");

    alert(
      `Data akan disimpan:\n\n` +
        `Nama: ${formData.nama}\n` +
        `Alamat: ${formData.alamat}\n` +
        `Kontak: ${formData.contact}\n` +
        `Kriteria:\n${nilaiKriteriaStr}\n` +
        `Keterangan: ${formData.keterangan}`
    );

    setTimeout(() => {
      if (isEdit) {
        setOrders((prev) =>
          prev.map((item) => (item.id === formData.id ? formData : item))
        );
        console.log("Update sent to API:", formData);
      } else {
        setOrders((prev) => [...prev, formData]);
        console.log("Create sent to API:", formData);
      }
      closeModal();
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus supplier ini?")) {
      setTimeout(() => {
        setOrders((prev) => prev.filter((item) => item.id !== id));
        console.log("Delete request sent to API for id:", id);
      }, 300);
    }
  };
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl dark:text-gray-300">Data Supplier</h2>
        {user.role === "staff" && (
          <button
            onClick={() => openModal()}
            className="rounded px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            + Tambah Supplier
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

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-md dark:text-white/90">
                            {order.nama}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                      {order.alamat}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                      <div className="flex -space-x-2">{order.contact}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        {dummyKriteria.map((kriteria) => {
                          const nilai =
                            order.nilaiKriteria.find(
                              (n) => n.kriteriaId === kriteria.id
                            )?.nilai ?? "-";
                          return (
                            <div key={kriteria.id}>
                              <span className="font-medium">
                                {kriteria.nama}:
                              </span>{" "}
                              {nilai}
                            </div>
                          );
                        })}

                        {/* {kriteriaList.map((kriteria) => (
                          <div key={kriteria.id}>
                            <span className="font-medium">
                              {kriteria.nama}:
                            </span>{" "}
                            {getNilaiSupplierByKriteria(order, kriteria.id)}
                          </div>
                        ))} */}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-md dark:text-gray-400">
                      <div className="flex -space-x-2">{order.keterangan}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-md dark:text-gray-400">
                      {user.role === "staff" && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => openModal(order)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
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
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <h2 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
          {isEdit ? "Edit Supplier" : "Tambah Supplier"}
        </h2>
        <div className="mt-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Nama Supplier
            </label>
            <input
              type="text"
              placeholder="Nama Supplier"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
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
                setFormData({ ...formData, alamat: e.target.value })
              }
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
              placeholder="Enter phone number"
              onChange={(phone) => setFormData({ ...formData, contact: phone })}
              selectPosition="start"
            />
          </div>
          <ComponentCard title="Input Kriteria">
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
              {dummyKriteria.map((k) => {
                const existing = formData.nilaiKriteria.find(
                  (item) => item.kriteriaId === k.id
                );
                return (
                  <div key={k.id}>
                    <label className="block font-medium mb-1">{k.nama}</label>
                    <input
                      type="number"
                      value={existing?.nilai ?? ""}
                      onChange={(e) => {
                        const nilaiBaru = Number(e.target.value);
                        setFormData((prev) => {
                          const nilaiKriteriaBaru = [...prev.nilaiKriteria];
                          const index = nilaiKriteriaBaru.findIndex(
                            (item) => item.kriteriaId === k.id
                          );

                          if (index > -1) {
                            nilaiKriteriaBaru[index].nilai = nilaiBaru;
                          } else {
                            nilaiKriteriaBaru.push({
                              kriteriaId: k.id,
                              nilai: nilaiBaru,
                            });
                          }

                          return { ...prev, nilaiKriteria: nilaiKriteriaBaru };
                        });
                      }}
                      className="mb-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm"
                    />
                  </div>
                );
              })}

              {/* {kriteriaList.map((k) => {
                const existing = formData.nilaiKriteria.find(
                  (item) => item.kriteriaId === k.id
                );
                return (
                  <div key={k.id} className="mb-3">
                    <label className="block font-medium mb-1">{k.nama}</label>
                    <input
                      type="number"
                      value={existing?.nilai ?? ""}
                      onChange={(e) => {
                        const nilaiBaru = Number(e.target.value);
                        setFormData((prev) => {
                          const nilaiKriteriaBaru = [...prev.nilaiKriteria];
                          const index = nilaiKriteriaBaru.findIndex(
                            (item) => item.kriteriaId === k.id
                          );

                          if (index > -1) {
                            nilaiKriteriaBaru[index].nilai = nilaiBaru;
                          } else {
                            nilaiKriteriaBaru.push({
                              kriteriaId: k.id,
                              nilai: nilaiBaru,
                            });
                          }

                          return { ...prev, nilaiKriteria: nilaiKriteriaBaru };
                        });
                      }}
                      className="mb-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm"
                    />
                  </div>
                );
              })} */}
            </div>
          </ComponentCard>
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
