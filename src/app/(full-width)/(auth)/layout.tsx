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
    <div className="relative min-h-screen bg-blue-light-50 dark:bg-gray-900">
      <ThemeProvider>
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left side: main content */}
          <main className="flex flex-1 flex-col justify-center px-2 sm:px-12 py-12 lg:max-w-xl lg:mx-auto">
            {children}
          </main>
          {/* Right side: sidebar with grid shape and logo */}
          <aside className="hidden lg:flex flex-col items-center justify-center flex-1 bg-sky-900 dark:bg-white/5 relative overflow-hidden">
            <GridShape />
            <div className="relative z-10 flex flex-col items-center max-w-xs px-6 text-center">
              <Link href="/" className="block mb-6">
                <Image
                  width={231}
                  height={48}
                  src="/images/logo/logo.png"
                  alt="Logo"
                  priority
                />
              </Link>
              <p className="text-gray-100 dark:text-white/60 text-lg font-normal">
                we wok de tok not onle tok de tok
              </p>
            </div>
          </aside>

          {/* Theme toggle fixed */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
