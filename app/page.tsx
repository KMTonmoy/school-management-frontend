"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudentPage } from "@/components/StudentPage";
import TeacherPage from "@/components/TeacherPage";
import { AdminPage } from "@/components/AdminPage";

const DashboardPage = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      if (!storedRole) {
        router.push("/login");
      } else {
        setRole(storedRole);
      }
    }
  }, [router]);

  if (role === null) {
    return null;
  }

  switch (role) {
    case "admin":
      return <AdminPage />;
    case "teacher":
      return <TeacherPage />;
    case "student":
      return <StudentPage />;
    default:
      router.push("/login");
      return null;
  }
};

export default DashboardPage;
