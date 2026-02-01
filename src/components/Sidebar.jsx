/** @format */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  Dumbbell,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, setIsMobileOpen, darkMode, toggleTheme }) => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Close sidebar when a navigation link is clicked (Mobile UX)
  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/log", icon: PlusCircle, label: "Log Workout" },
    { path: "/history", icon: CalendarDays, label: "History" },
    { path: "/exercises", icon: Dumbbell, label: "Exercises" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------------- */}
      {/* 1. MOBILE BACKDROP                                                     */}
      {/* Darkens the rest of the screen when the mobile menu is open.           */}
      {/* ---------------------------------------------------------------------- */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className='fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200'
        />
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. SIDEBAR CONTAINER                                                   */}
      {/* Handles responsive transitions (slide-in on mobile, static on desktop) */}
      {/* ---------------------------------------------------------------------- */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
      `}
      >
        {/* HEADER: LOGO & CLOSE BUTTON */}
        <div className='p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center'>
          <h2 className='text-2xl font-black text-blue-600 dark:text-blue-500 flex items-center gap-2'>
            <div className='w-12 h-12 rounded-[5px] flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <img
                src='/public/favicon.png'
                alt='favicon'
                className='w-8 h-8 rounded-[5px] object-cover'
              />
            </div>
            GymTracker
          </h2>
          {/* Close 'X' button (Only visible on Mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className='md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-white'
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY: NAVIGATION LINKS */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-none"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={isActive ? "stroke-[2.5px]" : ""}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER: THEME TOGGLE & LOGOUT */}
        <div className='p-4 border-t border-gray-50 dark:border-gray-800 space-y-3'>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium'
          >
            {darkMode ? (
              <Sun size={20} className='text-orange-400' />
            ) : (
              <Moon size={20} className='text-blue-600' />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout Trigger */}
          <button
            onClick={handleLogoutClick}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all font-medium'
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. LOGOUT CONFIRMATION MODAL                                           */}
      {/* ---------------------------------------------------------------------- */}
      {showLogoutModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in duration-200 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4'>
              <LogOut size={24} />
            </div>

            <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-2'>
              Log Out?
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
              Are you sure you want to sign out?
            </p>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowLogoutModal(false)}
                className='flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition'
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className='flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition'
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
