import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const navigationItems: NavItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      path: "/manuscripts",
      label: "My Manuscripts",
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
    {
      path: "/title-proposal",
      label: "Title Proposal",
      icon: <PencilSquareIcon className="w-5 h-5" />,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
    {
      path: "/schedule",
      label: "Schedule",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`
        bg-white border-r border-gray-200 
        ${isCollapsed ? "w-16" : "w-64"} 
        transition-all duration-300 
        flex flex-col 
        fixed left-0 top-0 h-screen 
        z-30
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="text-xl font-bold text-gray-800">CoreResearch</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-2 py-4 space-y-1 overflow-y-auto"
        role="navigation"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-2 py-2 text-sm font-medium rounded-md
              transition-colors duration-150
              ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
              ${isCollapsed ? "justify-center" : "space-x-3"}
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User info */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
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
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
