"use client";
import React from "react";
import Image from "next/image";
import { BoxIconLine, GroupIcon } from "@/icons";

interface Props {
  supplierCount: number;
  reportCount: number;
}

export const DataGeneralStaff: React.FC<Props> = ({ supplierCount, reportCount }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image
            src={GroupIcon}
            alt="Supplier Icon"
            width={20}
            height={20}
            className="text-gray-800 size-6 dark:text-white/90"
          />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-base text-gray-700 dark:text-gray-400">
              Jumlah Supplier
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {supplierCount}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image
            src={BoxIconLine}
            alt="Report Icon"
            width={20}
            height={20}
            className="text-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-base text-gray-700 dark:text-gray-400">
              Laporan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
              {reportCount}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
