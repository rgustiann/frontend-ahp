"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import * as Icons from "@/icons";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password); // login akan redirect otomatis sesuai role
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login gagal");
      } else {
        setError("Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1  w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan Username dan Password untuk masuk.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Masukkan Username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              {error && (
                <p className="text-error-500 text-sm font-medium">{error}</p>
              )}
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Loading..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
