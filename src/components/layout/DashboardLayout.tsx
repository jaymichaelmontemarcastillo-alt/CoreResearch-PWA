import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Header - fixed at top of content */}
        <Header />

        {/* Page Content - scrollable */}
        <main className="flex-1 p-4 md:p-6 overflow-auto mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
