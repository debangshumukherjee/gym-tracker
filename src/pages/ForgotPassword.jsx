import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); 
  
  const navigate = useNavigate();

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
      const res = await fetch(`${API_URL}/api/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();

      if (res.ok) {
        showToast("OTP sent successfully!"); 
        
        // Delay navigation slightly so user sees the success message
        setTimeout(() => {
            navigate('/reset-password', { state: { email } });
        }, 1000); 
      } else {
        showToast(data.message || "Error sending OTP", "error");
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
      
      {/* MAIN CARD */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in border border-gray-100 dark:border-gray-700">
        
        {/* Back Link */}
        <Link to="/login" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-4 inline-flex items-center gap-1">
          <ArrowLeft size={16}/> Back
        </Link>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Enter your email and we'll send you a 6-digit OTP to reset your password.</p>
        
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-10 p-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors" 
                placeholder="name@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none">
            {loading ? <Loader2 className="animate-spin"/> : "Send OTP"}
          </button>
        </form>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}>
          {toast.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;