"use client";
import React, { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRanking: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onViewRanking,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-fadeIn animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <Icon icon="mdi:close" className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
            <Icon icon="mdi:check-circle" className="text-green-600 dark:text-green-400 w-12 h-12" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Laporan Berhasil Dibuat!
        </h2>

        <div className="flex mt-3 justify-end gap-2">
          <Button onClick={onViewRanking}>Lihat Ranking</Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
