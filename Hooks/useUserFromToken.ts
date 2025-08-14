"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface UserData {
  email?: string;
  name?: string;
  role?: string;
}

interface UseUserFromTokenResult {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  status: "authenticated" | "unauthenticated" | "loading" | "error";
  message: string;
}

export const useUserFromToken = (): UseUserFromTokenResult => {
  const [state, setState] = useState<UseUserFromTokenResult>({
    user: null,
    loading: true,
    error: null,
    status: "loading",
    message: "Checking authentication status..."
  });

  useEffect(() => {
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setState({
            user: null,
            loading: false,
            error: null,
            status: "unauthenticated",
            message: "No authentication token found"
          });
          return;
        }

        const decoded = jwtDecode<UserData>(token);
        const userData: UserData = {
          email: decoded.email || "",
          name: decoded.name || decoded.email?.split("@")[0] || "User",
          role: decoded.role
        };

        setState({
          user: userData,
          loading: false,
          error: null,
          status: "authenticated",
          message: "Authentication successful"
        });
      } catch (err) {
        console.error("Token error:", err);
        setState({
          user: null,
          loading: false,
          error: "Invalid session",
          status: "error",
          message: "Authentication failed"
        });
      }
    };

    getUserFromToken();

    const handleStorageChange = () => getUserFromToken();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return state;
};