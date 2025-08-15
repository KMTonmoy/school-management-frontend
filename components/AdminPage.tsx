"use client";
import { useEffect } from "react";

const AdminPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Admin-specific content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Manage Users</h3>
        {/* Admin content */}
      </div>
    </div>
  );
};

export default AdminPage;
