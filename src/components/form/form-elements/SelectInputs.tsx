"use client";
import React from "react";
import Image from "next/image";
import Label from "../Label";
import Select from "../Select";
import { ChevronDownIcon } from "@/icons";

interface SelectInputsProps {
  value: string;
  onChange: (value: string) => void;
}
export default function SelectInputRole({ value, onChange }: SelectInputsProps) {
  const options = [
    { value: "staff", label: "Staff" },
    { value: "junior_manager", label: "Manager" }
  ];

  const handleSelectChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
      <div className="space-y-6">
        <div>
          <Label>Pilih Role</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Role"
              value={value}
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <Image
                src={ChevronDownIcon}
                alt="Horizontal Dots"
                width={20}
                height={20}
                className="text-gray-800 dark:text-white"
              />
            </span>
          </div>
        </div>
      </div>
  );
}
