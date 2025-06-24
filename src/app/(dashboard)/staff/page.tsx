"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function StaffHomePage() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-12 md:gap-6">
      <div className="hidden xl:col-span-1 xl:block"></div>
      <div className="col-span-12 space-y-6 xl:col-span-10">
        <h1 className="font-bold text-6xl text-center dark:text-gray-300">
          Selamat Datang, {user?.username || "Pengguna"}!
        </h1>
        <div className="mt-10 p-6 bg-white/70 dark:bg-gray-800 rounded-2xl shadow-md space-y-4">
          <p className="text-gray-800 dark:text-gray-100 text-justify text-lg leading-relaxed">
            Anda telah berhasil masuk ke dalam{" "}
            <strong>sistem informasi pemilihan supplier</strong> pada{" "}
            <strong>Divisi Alat Berat PT. Pindad (Persero)</strong>. Sistem ini
            dirancang untuk membantu proses pengambilan keputusan dalam
            menentukan prioritas supplier berdasarkan berbagai kriteria
            penilaian.
          </p>
          <p className="text-gray-800 dark:text-gray-100 text-justify text-lg leading-relaxed">
            <strong>Apa itu AHP?</strong>
            <br />
            Metode <em>Analytical Hierarchy Process (AHP)</em> adalah pendekatan
            pengambilan keputusan yang membantu membandingkan beberapa
            alternatif secara terstruktur berdasarkan sejumlah kriteria.
          </p>
          <p className="text-gray-800 dark:text-gray-100 text-justify text-lg leading-relaxed">
            <strong>Bagaimana Sistem Ini Bekerja?</strong>
            <br />
            Pengguna dapat memasukkan data supplier dan kriteria penilaian,
            kemudian melakukan perbandingan antar supplier sesuai bahan baku
            yang dipilih. Hasil perhitungan akan ditampilkan secara otomatis,
            lengkap dengan tingkat konsistensinya, dan dapat diajukan untuk
            disetujui oleh pihak manajer melalui laporan akhir.
          </p>
        </div>
      </div>
    </div>
  );
}
