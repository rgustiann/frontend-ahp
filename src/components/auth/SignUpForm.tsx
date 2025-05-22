"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import * as Icons from "@/icons";
import Link from "next/link";
import React, { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  type IconType =
    | React.FC<React.SVGProps<SVGSVGElement>>
    | { default: React.FC<React.SVGProps<SVGSVGElement>> }
    | null
    | undefined;

  const renderIcon = (IconComponent: IconType, className = "") => {
    if (typeof IconComponent === "function") {
      return <IconComponent className={className} />;
    } else if (
      IconComponent &&
      typeof IconComponent === "object" &&
      "default" in IconComponent &&
      typeof IconComponent.default === "function"
    ) {
      const Icon = IconComponent.default;
      return <Icon className={className} />;
    }
    return null;
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Buat akun untuk menggunakan website!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-5">
                  {/* <!-- First Name --> */}
                  <div>
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Masukkan Nama Panjang"
                    />
                  </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Username<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Masukkan Username"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Masukkan Password"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword
                        ? renderIcon(
                            Icons.EyeIcon,
                            "fill-gray-500 dark:fill-gray-400"
                          )
                        : renderIcon(
                            Icons.EyeCloseIcon,
                            "fill-gray-500 dark:fill-gray-400"
                          )}
                    </span>
                  </div>
                </div>
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Sudah punya akun?{"  "}
                <Link
                  href="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
