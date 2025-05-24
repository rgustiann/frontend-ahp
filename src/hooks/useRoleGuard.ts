"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useRoleGuard(allowedRoles: string[]) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized"); 
    }
  }, [user, isAuthenticated, allowedRoles, router]);
}
