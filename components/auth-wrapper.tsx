"use client";

import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasAuth(!!token);
  }, []);

  return (
    <>
      {hasAuth && <Sidebar />}
      <main className={`flex-1 overflow-auto ${hasAuth ? "md:ml-64 p-6" : ""}`}>
        {children}
      </main>
    </>
  );
}
