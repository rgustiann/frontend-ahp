import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <ThemeProvider>
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left side: main content */}
          <main className="flex flex-1 flex-col justify-center px-2 sm:px-12 py-12 lg:max-w-xl lg:mx-auto">
            {children}
          </main>
          {/* Right side: sidebar with grid shape and logo */}
          <aside className="hidden lg:flex flex-col items-center justify-center flex-1 bg-blue-light-100 dark:bg-white/5 relative overflow-hidden">
            <GridShape />
            <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
              <Link href="/" className="block mb-6">
                <Image
                  width={231}
                  height={48}
                  src="/images/logo/logo_pindad.png"
                  alt="Logo"
                  priority
                />
              </Link>
              <p className="text-sky-900 dark:text-white/60 text-lg font-semibold">
                PT. PINDAD
              </p>
              <p className="text-sky-900 dark:text-white/60 text-base">
                Divisi Alat Berat
              </p>
              <p className="text-sky-900 dark:text-white/60 text-sm mt-2">
                Sistem Informasi Pemilihan Prioritas Supplier
              </p>
              <p className="text-sky-900 dark:text-white/60 text-sm">
                Metode Analytical Hierarchy Process (AHP)
              </p>
            </div>
          </aside>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
