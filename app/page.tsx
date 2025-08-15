// app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";
import { StudentPage } from "@/components/StudentPage";
import TeacherPage from "@/components/TeacherPage";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if role exists in localStorage
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      if (!role) {
        router.push("/login");
      }
    }
  }, [router]);

  const role = localStorage.getItem("role");

  switch (role) {
    case "admin":
      return <AdminPage />;
    case "teacher":
      return <TeacherPage />;
    case "student":
      return <StudentPage />;
    default:
      router.push("/login");
  }
};

export default DashboardPage;
