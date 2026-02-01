import React, { useState } from 'react';
import { Lock, Loader2, KeyRound, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  // Initialize email from navigation state (if redirected from Forgot Password)
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); 

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/auth/resetpassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      });

      const data = await res.json();

      if (res.ok) {
          showToast("Password updated successfully!"); 
          
          // Redirect to login after a brief delay
          setTimeout(() => {
             navigate('/login');
          }, 1500); 
      } else {
          showToast(data.message || "Invalid OTP or Email", "error");
      }
    } catch (err) { 
      showToast("Network error. Please try again.", "error"); 
    } finally { 
      setLoading(false); 
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Secure Account</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Enter the OTP sent to <b>{email || "your email"}</b> and set your new password.</p>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                className={`w-full pl-10 p-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-900 transition-colors ${location.state?.email ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'}`}
                placeholder="name@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                readOnly={!!location.state?.email} 
              />
            </div>
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                required 
                maxLength={6}
                className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white tracking-[0.25em] font-mono text-lg transition-colors" 
                placeholder="123456" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
              />
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-colors" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center shadow-lg shadow-blue-200 dark:shadow-none">
            {loading ? <Loader2 className="animate-spin"/> : "Change Password"}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}>
          {toast.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;