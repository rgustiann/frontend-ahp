"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, logout as apiLogout } from "@/lib/api/authService";
import { DecodedToken, User } from "@/types/user";
import { AuthContextType } from "@/types/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);

          const isExpired = decoded.exp * 1000 < Date.now();
          if (isExpired) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            return;
          }

          const parsedUser: User = JSON.parse(userData);
          setUser({ ...parsedUser, iat: decoded.iat, exp: decoded.exp });

        } catch (err) {
          console.error("Token decode error:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await apiLogin(username, password);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    console.log("Bearer Token:", token);
    // Role-based redirection
    if (user.role === "staff") {
      router.push("/staff/");
    } else {
      router.push("/manager/");
    }
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
