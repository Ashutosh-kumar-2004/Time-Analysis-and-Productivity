import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  AiOutlineDashboard,
  AiOutlineClockCircle,
  AiOutlineHistory,
  AiOutlineBarChart,
  AiOutlineUser,
} from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import NavbarShimmer from "./NavbarShimmer";
import { LuFolderKanban } from "react-icons/lu";
import { ShimmerBase } from "../shimmer/Shimmer";

const Navbar = () => {
  const { user: details, loading, logout } = useAuth(); // Use AuthContext
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const profileRef = useRef(null);

  const isLoggedIn = !!details || !!localStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    // Basic check to redirect if no token found on mount (preserving existing behavior)
    const token = localStorage.getItem("token");
    if (!token && location.pathname !== "/login") {
      // navigate("/login");
    }
  }, [location, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <AiOutlineDashboard />, link: "/dashboard" },
    { name: "Projects", icon: <LuFolderKanban />, link: "/projects" },
    {
      name: "Personal Analysis",
      icon: <AiOutlineBarChart />,
      link: "/personal-analysis",
      hideOnProjects: true,
    },
  ];

  // Filter menu items based on current route
  const visibleMenuItems = menuItems.filter((item) => {
    if (
      item.hideOnProjects &&
      (location.pathname.startsWith("/projects") ||
        location.pathname.startsWith("/project-details"))
    ) {
      return true;
    }
    return true;
  });
  if (loading) {
    return <NavbarShimmer />;
  }
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/">Productivity Tracker</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {visibleMenuItems.map((item) => {
              const isActive =
                item.link === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.link);

              return (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Theme Toggle, Timer and Profile */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              {/* Profile Dropdown - Click to open */}

              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200"
                >
                  {loading ? (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  ) : details?.avatar ? (
                    <img
                      src={details.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">U</span>
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                    isProfileOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="py-1">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      {loading ? (
                        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <p className="font-medium">
                          {details?.firstName} {details?.lastName}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <AiOutlineUser className="mr-3" />
                      Profile
                    </Link>

                    <div className="border-t dark:border-gray-700 my-1"></div>

                    <button
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-left"
                      onClick={handleLogout}
                    >
                      <FaTimes className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button with Theme Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {visibleMenuItems.map((item) => {
            const isActive =
              item.link === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.link);

            return (
              <Link
                key={item.name}
                to={item.link}
                className={`flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsProfileOpen(false)}
          >
            <AiOutlineUser className="mr-3" />
            Profile
          </Link>
          {/* Profile Section in Mobile Menu */}
          <div className="px-4 py-3 flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white mr-3">
              {details && details.avatar ? (
                <img
                  src={details.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : details ? (
                details.firstName[0].toUpperCase() +
                details.lastName[0].toUpperCase()
              ) : (
                "PT"
              )}
            </div>

            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {details ? (
                  details.firstName + " " + details.lastName
                ) : (
                  <ShimmerBase className="w-24 h-4" />
                )}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {details ? details.email : <ShimmerBase className="w-32 h-3" />}
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
