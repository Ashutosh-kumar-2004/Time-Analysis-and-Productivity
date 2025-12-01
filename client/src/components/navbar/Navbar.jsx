import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineDashboard, AiOutlineClockCircle, AiOutlineHistory, AiOutlineBarChart, AiOutlineUser } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const profileRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

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
    { name: "Track Time", icon: <AiOutlineClockCircle />, link: "/track-time" },
    { name: "History", icon: <AiOutlineHistory />, link: "/history" },
    { name: "Analytics", icon: <AiOutlineBarChart />, link: "/analytics" },
    { name: "Profile", icon: <AiOutlineUser />, link: "/profile" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 font-bold text-xl text-blue-500 dark:text-blue-400">
            ProductivityTracker
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}

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
                  className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="Open profile menu"
                  aria-expanded={isProfileOpen}
                >
                  PT
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                    isProfileOpen 
                      ? "opacity-100 visible transform translate-y-0" 
                      : "opacity-0 invisible transform -translate-y-2"
                  }`}
                >
                  <div className="py-1">
                    <a
                      href="/profile-settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <AiOutlineUser className="mr-3" />
                      Profile Settings
                    </a>
                    <a
                      href="/productivity-goals"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <AiOutlineBarChart className="mr-3" />
                      Productivity Goals
                    </a>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <a 
                      href="/logout" 
                      className="flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaTimes className="mr-3" />
                      Logout
                    </a>
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
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="ml-3 text-gray-800 dark:text-gray-200">{item.name}</span>
            </a>
          ))}

          {/* Profile Section in Mobile Menu */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
            <div className="px-4 py-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                PT
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Productivity User</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
              </div>
            </div>
            
            <a
              href="/profile-settings"
              className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineUser className="mr-3" />
              Profile Settings
            </a>
            <a
              href="/productivity-goals"
              className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineBarChart className="mr-3" />
              Productivity Goals
            </a>
            <a 
              href="/logout" 
              className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes className="mr-3" />
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;