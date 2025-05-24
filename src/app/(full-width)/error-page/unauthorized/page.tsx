"use client"
import GridShape from "@/components/common/GridShape";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import React from "react";
import useGoBack from "@/hooks/useGoBack";

export default function Error404() {
  const goBack = useGoBack();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          ERROR
        </h1>

        <Image
          src="/images/error/unauthorized.svg"
          alt="404"
          className="dark:hidden"
          width={472}
          height={152}
        />
        <Image
          src="/images/error/unauthorized-dark.svg"
          alt="404"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          We can’t seem to find the page you are looking for!
        </p>

        <Button
          onClick={goBack}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs"
        >
          Back to Home Page
        </Button>
      </div>
    </div>
  );
}
