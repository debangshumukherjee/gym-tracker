/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { API_URL } from "../config";

const Signup = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check matching passwords
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);

    try {
      // API Call: Register User
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      // Success: Show Toast & Redirect
      showToast("Account created! Sending OTP...");

      // Slight delay to allow user to read success message before redirection
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 1500);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in'>
        {/* Header Section */}
        <div className='p-8 text-center bg-gray-900 dark:bg-gray-950 text-white'>
          <div className='w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center mx-auto mb-4 shadow-lg'>
            <img
              src='/Ffavicon.png'
              alt='favicon'
              className='w-8 h-8 rounded-md object-cover'
            />
          </div>

          <h1 className='text-2xl font-black'>Join Gym Tracker</h1>
          <p className='text-gray-400 text-sm mt-1'>
            Start tracking your fitness journey today.
          </p>
        </div>

        <div className='p-8'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Full Name */}
            <div>
              <label className='block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1'>
                Full Name
              </label>
              <input
                name='name'
                type='text'
                required
                className='w-full p-4 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1'>
                Email Address
              </label>
              <input
                name='email'
                type='email'
                required
                className='w-full p-4 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition'
                placeholder='name@example.com'
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Passwords Grid */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1'>
                  Password
                </label>
                <input
                  name='password'
                  type='password'
                  required
                  className='w-full p-4 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition'
                  placeholder='••••••'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className='block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1'>
                  Confirm
                </label>
                <input
                  name='confirmPassword'
                  type='password'
                  required
                  className='w-full p-4 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition'
                  placeholder='••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type='submit'
              className='w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition shadow-lg shadow-blue-200 dark:shadow-none flex justify-center items-center gap-2 group'
            >
              {loading ? (
                <Loader2 className='animate-spin' size={20} />
              ) : (
                "Create My Account"
              )}
            </button>
          </form>

          <p className='text-center text-gray-500 dark:text-gray-400 mt-8 text-sm'>
            Already have an account?{" "}
            <Link
              to='/login'
              className='text-blue-600 dark:text-blue-400 font-black hover:underline'
            >
              Sign In
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

export default Signup;
