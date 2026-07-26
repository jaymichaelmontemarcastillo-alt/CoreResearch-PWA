import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute: React.FC = () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);

    if (user.roleId === "admin") {
      return <Outlet />;
    }

    return <Navigate to="/dashboard" replace />;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
