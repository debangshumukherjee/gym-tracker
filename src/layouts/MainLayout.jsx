import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  
  // 1. Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Dark Mode State (Persisted in LocalStorage)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Apply Dark Mode class to the HTML root element whenever state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Toggle Handler
  const toggleTheme = () => setDarkMode(!darkMode);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. SIDEBAR (Navigation) */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        setIsMobileOpen={setIsMobileMenuOpen}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* 2. MOBILE HEADER (Burger Button & Logo) */}
      {/* Visible only on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 z-30">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={24} />
        </button>
        <span className="ml-3 font-black text-blue-600 dark:text-blue-500 text-lg">GymTracker</span>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      {/* 'md:ml-64' pushes content to the right on desktop to accommodate Sidebar */}
      {/* 'pt-20' adds top padding on mobile for the fixed header */}
      <main className="p-4 pt-20 md:pt-4 md:ml-64 max-w-5xl mx-auto transition-all duration-300">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;