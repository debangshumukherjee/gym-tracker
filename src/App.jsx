/** @format */

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./layouts/MainLayout";

// --- PAGES ---
import Dashboard from "./pages/Dashboard";
import LogWorkout from "./pages/LogWorkout";
import History from "./pages/History";
import Exercises from "./pages/Exercises";
import Settings from "./pages/Settings";

// --- AUTH PAGES ---
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Footer from "./components/Footer";

// -----------------------------------------------------------------------------
// ROUTE GUARDS
// -----------------------------------------------------------------------------

/**
 * Protects routes that require authentication.
 * If no token is found, redirects to Login.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to='/login' replace />;
};

/**
 * Restricts access to auth pages (Login, Signup) for logged-in users.
 * If a token exists, redirects to Dashboard.
 */
const PublicRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to='/' replace /> : <Outlet />;
};

// -----------------------------------------------------------------------------
// APP COMPONENT
// -----------------------------------------------------------------------------

function App() {
  useEffect(() => {
    console.log(
      "%c Built by Debangshu Mukherjee 🚀 ",
      "background: #222; color: #bada55; font-size: 20px; padding: 10px; border-radius: 5px; min-width: 100px; text-align: center;",
    );
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. PUBLIC AUTH ROUTES (Only accessible if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/verify-otp' element={<VerifyOTP />} />
        </Route>

        {/* 2. PROTECTED APP ROUTES (Only accessible if logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='log' element={<LogWorkout />} />
            <Route path='history' element={<History />} />
            <Route path='exercises' element={<Exercises />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Route>

        {/* 3. CATCH-ALL (Redirects unknown routes to Login) */}
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
