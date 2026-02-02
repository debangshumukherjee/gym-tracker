/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { API_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResend(false);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle unverified account status (403 Forbidden)
      if (response.status === 403) {
        setError("Please verify your email before logging in.");
        setShowResend(true);
        return;
      }

      if (!response.ok) throw new Error(data.message || "Login failed");

      // Success: Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      showToast(data.message || "OTP resent! Check your inbox.");

      // Redirect to verification page after short delay
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 1500);
    } catch (err) {
      showToast("Failed to resend OTP.", "error");
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden'>
        {/* Header Section */}
        <div className='bg-blue-600 dark:bg-blue-700 p-8 text-center text-white'>
          <div className='w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center mx-auto mb-4 shadow-lg'>
            <img
              src='/public/favicon.png'
              alt='favicon'
              className='w-8 h-8 rounded-md object-cover'
            />
          </div>

          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-blue-100 mt-1'>Sign in to continue your streak.</p>
        </div>

        <div className='p-8'>
          {/* Error Alert */}
          {error && (
            <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-fade-in'>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1'>
                Email Address
              </label>
              <input
                name='email'
                type='email'
                required
                className='w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                placeholder='you@example.com'
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 ml-1'>
                  Password
                </label>
                <Link
                  to='/forgot-password'
                  size='sm'
                  className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                name='password'
                type='password'
                required
                className='w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Resend Verification Link (Conditional) */}
            {showResend && (
              <button
                type='button'
                onClick={handleResend}
                className='w-full py-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition mb-2'
              >
                Resend Verification Code?
              </button>
            )}

            <button
              disabled={loading}
              type='submit'
              className='w-full py-3 bg-gray-900 dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-blue-700 transition flex justify-center items-center gap-2 group shadow-lg dark:shadow-none'
            >
              {loading ? (
                <Loader2 className='animate-spin' size={20} />
              ) : (
                <>
                  Sign In{" "}
                  <ArrowRight
                    size={18}
                    className='group-hover:translate-x-1 transition-transform'
                  />
                </>
              )}
            </button>
          </form>

          <p className='text-center text-gray-500 dark:text-gray-400 mt-6 text-sm'>
            Need an account?{" "}
            <Link
              to='/signup'
              className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span className='font-bold text-sm'>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Login;
