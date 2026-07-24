import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Page Components
import Dashboard from "./pages/Dashboard";
import Manuscripts from "./pages/Manuscripts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
/*import TitleProposal from "./pages/TitleProposal";
import Analytics from "./pages/Analytics";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";*/

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manuscripts" element={<Manuscripts />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] text-white">
              Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
