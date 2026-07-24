import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

interface HeaderProps {
  pageTitle?: string;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Get page title from route if not provided
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;

    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) return "Dashboard";

    // Convert kebab-case to Title Case
    return segments[segments.length - 1]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user display name and avatar
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 fixed top-0 right-0 left-0 md:left-64 z-20 transition-all duration-300">
      <div className="flex-1 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h1>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notification Button */}
          <button
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {displayName}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
