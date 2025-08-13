"use client";
import { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, Mail, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface UserToken {
  email?: string;
  name?: string;
  // Add other token properties if needed
}

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        router.push("/login");
      } else {
        try {
          const decoded = jwtDecode<UserToken>(token);
          if (decoded.email || decoded.name) {
            setUser({
              email: decoded.email || "",
              name: decoded.name || decoded.email?.split("@")[0] || "User",
            });
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid token", error);
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">School Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            {user && (
              <>
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span className="font-medium">{getInitial()}</span>
          </div>
        </div>
      </div>

      {/* Rest of your dashboard content remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ... existing dashboard content ... */}
      </div>
    </div>
  );
};

export default DashboardPage;
