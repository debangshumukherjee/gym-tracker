/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Save,
  LogOut,
  Loader2,
  Activity,
  PlusCircle,
  HeartPulse,
  AlertCircle,
  CheckCircle,
  Trash2,
  Lock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { API_URL } from "../config";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  // UI & Modal States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Weight Logging State
  const [loggingWeight, setLoggingWeight] = useState(false);
  const [weightLog, setWeightLog] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
  });
  const [weightHistory, setWeightHistory] = useState([]);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    gender: "Male",
    createdAt: new Date().toISOString(),
  });

  const [calculatedAge, setCalculatedAge] = useState(null);

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

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
            height: data.height || "",
            weight: data.currentWeight || "",
            gender: data.gender || "Male",
            createdAt: data.createdAt || new Date().toISOString(),
          });

          setWeightLog((prev) => ({
            ...prev,
            weight: data.currentWeight || "",
          }));
          setCalculatedAge(data.age);
          setWeightHistory(data.weightHistory || []);
        }
      } catch (err) {
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setCalculatedAge(data.age);
        showToast("Profile updated!");
      } else {
        showToast("Update failed", "error");
      }
    } catch (err) {
      showToast("Connection error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleWeightLog = async (e) => {
    e.preventDefault();
    setLoggingWeight(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/weight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(weightLog),
      });
      const data = await res.json();
      if (res.ok) {
        setWeightHistory(data.weightHistory);
        setFormData((prev) => ({ ...prev, weight: data.currentWeight }));
        showToast(`Weight updated!`);
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Failed to log weight", "error");
    } finally {
      setLoggingWeight(false);
    }
  };

  const initiateDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/delete-initiate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteStep(2);
        showToast("OTP sent to your email");
      } else {
        showToast("Failed to send OTP", "error");
      }
    } catch (e) {
      showToast("Error initiating delete", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/delete-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: deleteOtp }),
      });
      if (res.ok) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        const data = await res.json();
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (e) {
      showToast("Error deleting account", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SUB-COMPONENTS
  // ---------------------------------------------------------------------------

  const BMICard = ({ height, weight, gender }) => {
    if (!height || !weight) return null;
    const hM = height / 100;
    const bmi = (weight / (hM * hM)).toFixed(1);
    const minHealthy = (18.5 * hM * hM).toFixed(1);
    const maxHealthy = (24.9 * hM * hM).toFixed(1);

    let category = "",
      color = "",
      percentage = 0;
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
      percentage = 15;
    } else if (bmi < 25) {
      category = "Healthy";
      color = "text-green-500";
      percentage = 50;
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-500";
      percentage = 75;
    } else {
      category = "Obese";
      color = "text-red-500";
      percentage = 90;
    }

    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='font-bold text-gray-800 dark:text-white flex items-center gap-2'>
              <HeartPulse size={18} className='text-red-500' /> BMI Calculator
            </h2>
            <p className='text-xs text-gray-400 mt-1'>
              For {gender}, {height}cm
            </p>
          </div>
          <div className='text-right'>
            <span className={`text-2xl font-black ${color}`}>{bmi}</span>
            <p className={`text-[10px] font-bold uppercase ${color}`}>
              {category}
            </p>
          </div>
        </div>
        <div className='h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex relative mb-6'>
          <div className='w-[25%] h-full bg-blue-300'></div>
          <div className='w-[35%] h-full bg-green-400'></div>
          <div className='w-[25%] h-full bg-yellow-400'></div>
          <div className='w-[15%] h-full bg-red-400'></div>
          <div
            className='absolute top-0 bottom-0 w-1 bg-black dark:bg-white transition-all duration-500'
            style={{ left: `${percentage}%` }}
          ></div>
        </div>
        <div className='bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800'>
          <span className='block text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-1'>
            Target Range
          </span>
          <span className='text-lg font-black text-gray-800 dark:text-white'>
            {minHealthy}kg - {maxHealthy}kg
          </span>
        </div>
      </div>
    );
  };

  const WeightChart = ({ data }) => {
    if (!data || data.length < 1) {
      return (
        <div className='text-sm text-gray-400 italic p-6 text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-600'>
          Log your weight to see progress history.
        </div>
      );
    }

    const chartData = data.map((d) => ({
      ...d,
      displayDate: format(parseISO(d.date), "MMM d"),
      fullDate: format(parseISO(d.date), "MMMM do, yyyy"),
    }));

    return (
      <div className='h-64 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='colorWeight' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#2563eb' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#2563eb' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#e5e7eb'
              className='dark:stroke-gray-700'
            />
            <XAxis
              dataKey='displayDate'
              stroke='#9ca3af'
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke='#9ca3af'
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(val) => Number(val).toFixed(1)}
              unit='kg'
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => [`${Number(value).toFixed(1)} kg`, "Weight"]}
              labelStyle={{ color: "#9ca3af", marginBottom: "0.25rem" }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0)
                  return payload[0].payload.fullDate;
                return label;
              }}
            />
            <Area
              type='monotone'
              dataKey='weight'
              stroke='#2563eb'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorWeight)'
              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (loading)
    return (
      <div className='flex justify-center h-64 items-center'>
        <Loader2 className='animate-spin text-blue-600' />
      </div>
    );

  return (
    <div className='max-w-2xl mx-auto space-y-6 animate-fade-in pb-10 relative'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
        Profile & Settings
      </h1>

      {/* BMI Calculator Card */}
      <BMICard
        height={formData.height}
        weight={formData.weight}
        gender={formData.gender}
      />

      {/* WEIGHT LOG SECTION */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors'>
        <h2 className='font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6'>
          <Activity size={18} className='text-blue-500' /> Weight Progress
        </h2>

        {/* Render the New Chart */}
        <div className='mb-8'>
          <WeightChart data={weightHistory} />
        </div>

        <form
          onSubmit={handleWeightLog}
          className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex gap-3 items-end'
        >
          <div className='flex-1'>
            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
              Date
            </label>
            <input
              type='date'
              required
              max={new Date().toISOString().split("T")[0]}
              value={weightLog.date}
              onChange={(e) =>
                setWeightLog({ ...weightLog, date: e.target.value })
              }
              className='w-full p-2.5 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none'
            />
          </div>
          <div className='flex-1'>
            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
              Weight (KG)
            </label>
            <input
              type='number'
              step='0.1'
              required
              value={weightLog.weight}
              onChange={(e) =>
                setWeightLog({ ...weightLog, weight: e.target.value })
              }
              className='w-full p-2.5 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={loggingWeight}
            className='px-4 py-2.5 bg-gray-900 dark:bg-blue-600 text-white rounded-lg text-sm font-bold'
          >
            {loggingWeight ? (
              <Loader2 className='animate-spin' size={16} />
            ) : (
              <PlusCircle size={16} />
            )}
          </button>
        </form>
      </div>

      {/* PERSONAL INFO FORM */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors'>
        <h2 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
          <User size={18} className='text-blue-500' /> Personal Details
        </h2>
        <form onSubmit={handleUpdate} className='space-y-6'>
          {/* 👇 Changed from 'grid-cols-1 md:grid-cols-2' to just 'grid-cols-2' */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='col-span-2'>
              <label className='text-xs font-bold text-gray-400 dark:text-gray-400 uppercase'>
                Full Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full mt-1 p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-xl outline-none'
              />
            </div>

            {/* Gender Select (Now shares row with Height) */}
            <div>
              <label className='text-xs font-bold text-gray-400 dark:text-gray-400 uppercase'>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='w-full mt-1 p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-xl outline-none'
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Height Input (Now shares row with Gender) */}
            <div>
              <label className='text-xs font-bold text-gray-400 dark:text-gray-400 uppercase'>
                Height (CM)
              </label>
              <input
                type='number'
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className='w-full mt-1 p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-xl outline-none'
              />
            </div>

            <div className='col-span-2'>
              <label className='text-xs font-bold text-gray-400 dark:text-gray-400 uppercase'>
                Date of Birth {calculatedAge && `(${calculatedAge})`}
              </label>
              <input
                type='date'
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className='w-full mt-1 p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-100 dark:border-gray-600 rounded-xl outline-none'
              />
            </div>

            <div className='col-span-2'>
              <label className='text-xs font-bold text-gray-400 dark:text-gray-400 uppercase'>
                Email
              </label>
              <input
                type='email'
                value={formData.email}
                disabled
                className='w-full mt-1 p-3 bg-gray-100 dark:bg-gray-600 dark:text-gray-400 text-gray-500 border border-gray-100 dark:border-gray-600 rounded-xl outline-none cursor-not-allowed'
              />
            </div>
          </div>
          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={saving}
              className='bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2'
            >
              {saving ? (
                <Loader2 className='animate-spin' size={18} />
              ) : (
                <Save size={18} />
              )}{" "}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* DANGER ZONE (Logout & Delete) */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors space-y-3'>
        <button
          onClick={() => setShowLogoutModal(true)}
          className='w-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition flex justify-center items-center gap-2'
        >
          <LogOut size={18} /> Log Out
        </button>
        <button
          onClick={() => {
            setShowDeleteModal(true);
            setDeleteStep(1);
          }}
          className='w-full text-red-600 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2'
        >
          <Trash2 size={18} /> Delete Account
        </button>
      </div>

      {/* --- TOAST NOTIFICATION --- */}
      {toast.show && (
        <div
          className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span className='font-bold text-sm'>{toast.message}</span>
        </div>
      )}

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4'>
              <LogOut size={24} />
            </div>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-2'>
              Log Out?
            </h3>
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => setShowLogoutModal(false)}
                className='flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className='flex-1 py-3 bg-red-600 text-white font-bold rounded-xl'
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE ACCOUNT MODAL --- */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-100 dark:border-gray-700 animate-scale-in'>
            {deleteStep === 1 ? (
              <>
                <div className='w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Trash2 size={24} />
                </div>
                <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-2'>
                  Delete Account?
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                  This will permanently erase all your workouts, exercises, and
                  history. We will send an OTP to your email to confirm.
                </p>
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className='flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={initiateDelete}
                    disabled={deleteLoading}
                    className='flex-1 py-3 bg-red-600 text-white font-bold rounded-xl flex justify-center items-center gap-2'
                  >
                    {deleteLoading ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Lock size={24} />
                </div>
                <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-2'>
                  Enter OTP
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                  Please enter the 6-digit code sent to your email.
                </p>
                <input
                  type='text'
                  placeholder='123456'
                  maxLength={6}
                  className='w-full p-3 mb-6 text-center text-2xl tracking-widest font-mono border rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:border-red-500'
                  value={deleteOtp}
                  onChange={(e) => setDeleteOtp(e.target.value)}
                />
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className='flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading || deleteOtp.length < 6}
                    className='flex-1 py-3 bg-red-600 text-white font-bold rounded-xl flex justify-center items-center gap-2'
                  >
                    {deleteLoading ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
