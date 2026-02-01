import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Resend Timer State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Countdown Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state?.email, otp })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Redirect to login with success message
        navigate('/login', { state: { message: "Account verified! Please login." } });
      } else {
        setError(data.message || "Invalid Code");
      }
    } catch (err) {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    // Reset Timer
    setTimer(60);
    setCanResend(false);
    
    try {
      await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state?.email })
      });
    } catch (err) {
      console.error("Resend failed");
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 animate-fade-in">
        
        {/* Icon Header */}
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto rotate-3 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Enter Code</h2>
          <p className="text-gray-500 text-sm">
            We sent a 6-digit code to <br/>
            <span className="font-bold text-gray-800">{state?.email || "your email"}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold animate-pulse">
            {error}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" 
            maxLength="6" 
            placeholder="000000"
            className="w-full text-center text-4xl font-black tracking-[0.75rem] p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-gray-200 text-gray-800"
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            autoFocus
          />
          
          <button 
            disabled={loading || otp.length < 6} 
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24}/> : "Verify & Continue"}
          </button>
        </form>

        {/* Resend Logic */}
        <div className="pt-4 border-t border-gray-100">
          <button 
            onClick={handleResend}
            disabled={!canResend}
            className={`text-sm font-bold flex items-center gap-2 mx-auto transition ${canResend ? 'text-blue-600 hover:text-blue-700' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <RefreshCw size={16} className={!canResend && 'animate-spin-slow'} />
            {canResend ? "Resend Code" : `Resend in ${timer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;