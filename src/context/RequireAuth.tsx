"use client";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles: string[]; 
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!allowedRoles.includes(user!.role)) {
        // Jika role tidak sesuai, redirect ke halaman lain misal Unauthorized
        router.push("/unauthorized");
      }
    }
  }, [loading, isAuthenticated, user, router, allowedRoles]);

  if (loading || !isAuthenticated || !allowedRoles.includes(user!.role)) {
    // Bisa tampil loading spinner atau kosong dulu sambil cek akses
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default RequireAuth;
