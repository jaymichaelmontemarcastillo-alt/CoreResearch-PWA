import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onMenuClick: () => void;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed, onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const titleMap: Record<string, string> = {
      dashboard: "Dashboard",
      manuscripts: "My Manuscripts",
      "title-proposal": "Title Proposal",
      analytics: "Analytics",
      schedule: "Schedule",
      notifications: "Notifications",
      profile: "Profile",
      settings: "Settings",
      admin: "Administration",
      users: "User Management",
      departments: "Departments",
      courses: "Courses",
    };

    const lastSegment = segments[segments.length - 1];
    return (
      titleMap[lastSegment] ||
      lastSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName =
    user?.displayName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "User");
  const photoURL = user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={`
        bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700
        h-14 flex items-center px-4 md:px-6
        fixed top-0 right-0 z-20
        transition-[left] duration-300 ease-smooth
        ${isSidebarCollapsed ? "md:left-[60px]" : "md:left-[220px]"}
        left-0
      `}
    >
      <div className="flex-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-sm pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-150"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="w-[18px] h-[18px]" />
            ) : (
              <MoonIcon className="w-[18px] h-[18px]" />
            )}
          </button>

          <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <BellIcon className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-800"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-dark-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-xs">
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline-block">
                {displayName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
