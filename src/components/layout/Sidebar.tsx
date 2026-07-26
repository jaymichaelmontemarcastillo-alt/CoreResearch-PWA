import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  departmentId?: string;
  isApproved?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserRole(parsedUser.roleId || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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

  const navItems: NavItem[] = [
    // Research Section
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <Squares2X2Icon className="w-5 h-5" />,
      section: "Research",
    },
    {
      path: "/manuscripts",
      label: "My Manuscripts",
      icon: <DocumentTextIcon className="w-5 h-5" />,
      section: "Research",
    },
    {
      path: "/title-proposal",
      label: "Title Proposal",
      icon: <PencilSquareIcon className="w-5 h-5" />,
      section: "Research",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <ChartBarIcon className="w-5 h-5" />,
      section: "Research",
    },

    // Academic Section
    {
      path: "/schedule",
      label: "Schedule",
      icon: <CalendarIcon className="w-5 h-5" />,
      section: "Academic",
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
      section: "Academic",
    },

    // Account Section
    {
      path: "/profile",
      label: "Profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
      section: "Account",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      section: "Account",
    },
  ];

  // Admin items
  const adminItems: NavItem[] = [
    {
      path: "/admin/users",
      label: "User Management",
      icon: <UsersIcon className="w-5 h-5" />,
      section: "Admin",
    },
    {
      path: "/admin/departments",
      label: "Departments",
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      section: "Admin",
    },
    {
      path: "/admin/courses",
      label: "Courses",
      icon: <AcademicCapIcon className="w-5 h-5" />,
      section: "Admin",
    },
  ];

  const allNavItems =
    userRole === "admin" ? [...navItems, ...adminItems] : navItems;

  // Group items by section
  const groupedItems = allNavItems.reduce(
    (acc, item) => {
      const section = item.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  const displayName =
    user?.displayName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "User");
  const photoURL = user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            C
          </div>
          <span
            className={`text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            Core
            <span className="text-primary-600 dark:text-primary-400">
              Research
            </span>
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section}
              </div>
            )}
            <div className="space-y-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) => `
                    group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100"
                    }
                    ${isCollapsed ? "justify-center" : "gap-3"}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
                  >
                    {item.label}
                  </span>
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-dark-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-dark-700">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm flex-shrink-0">
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
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
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
        <button
          onClick={handleLogout}
          className={`
            mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 
            hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 
            rounded-lg transition-colors
            ${isCollapsed ? "justify-center" : ""}
          `}
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700
          ${isCollapsed ? "w-[60px]" : "w-[220px]"}
          transition-all duration-300 ease-smooth
          fixed left-0 top-0 h-screen z-30
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-dark-800 
          border-r border-gray-200 dark:border-dark-700
          transform transition-transform duration-300 ease-smooth z-50
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
