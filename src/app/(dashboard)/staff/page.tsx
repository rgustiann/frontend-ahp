import type { Metadata } from "next";
import { DataGeneralStaff } from "@/components/visualization/DataGeneral";
import React from "react";
export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function StaffHomePage() {
  return (
    <div className="grid grid-cols-12 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <h1 className="font-bold text-6xl dark:text-gray-300"> Selamat Datang. Namanya siapa!</h1>
            <h2 className="dark:text-gray-400">Berikut adalah informasi yang tersimpan dalam basis data: </h2>
            <DataGeneralStaff />
          </div>
        </div>
  );
}
