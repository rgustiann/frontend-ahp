"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { TrophyIcon, TrophyDark } from "@/icons";

export const BestResult = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center mt-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-white/[0.03] md:p-6 flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image
            src={theme === "dark" ? TrophyDark : TrophyIcon}
            alt="Trophy Icon"
            width={30}
            height={30}
            className="size-10"
          />
        </div>

        <div className="mt-2 text-center">
          <span className="text-base text-gray-700 dark:text-gray-400">
            Rekomendasi Supplier
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            PT Jokowi Indah
          </h4>
        </div>
      </div>
    </div>
  );
};
