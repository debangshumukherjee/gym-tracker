import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Dumbbell, Flame, Activity, ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, parseISO, 
  addMonths, subMonths, subDays, subMonths as subMonthsFn, 
  eachMonthOfInterval 
} from 'date-fns';
import clsx from 'clsx';
import { API_URL } from '../config';

// --- HELPER FUNCTIONS ---

/**
 * Calculates the total volume (Weight * Reps) for a single workout log.
 */
const calculateVolume = (log) => {
  if (!log.exercises) return 0;
  return log.exercises.reduce((acc, ex) => {
    if (ex.sets) {
      return acc + ex.sets.reduce((sAcc, set) => sAcc + (set.weight * set.reps), 0);
    }
    return acc;
  }, 0);
};

// --- COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [graphRange, setGraphRange] = useState('1M'); 
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Get Name Safely (with fallback)
  const [userName, setUserName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.name || "Athlete"; 
      } catch (e) {
        return "Athlete";
      }
    }
    return "Athlete";
  });

  // 2. Fetch Workout Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
           navigate('/login');
           return;
        }

        const res = await fetch(`${API_URL}/api/workouts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Handle Session Expiry
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
        }

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
              setUserLogs(data);
          } else {
              setUserLogs([]);
          }
        }

      } catch (error) {
        console.error("Network Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // 3. Stats Calculations
  const totalWorkouts = userLogs.length;
  const totalVolume = userLogs.reduce((acc, log) => acc + calculateVolume(log), 0);
  
  // 4. Streak Calculation Logic
  const currentStreak = useMemo(() => {
    if (!userLogs.length) return 0;
    
    // Get unique dates sorted descending
    const workoutDates = [...new Set(userLogs.map(log => format(parseISO(log.date), 'yyyy-MM-dd')))].sort();
    
    let streak = 0;
    let checkDate = new Date();
    
    // Check backwards from today
    while (true) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const hasWorkout = workoutDates.includes(dateStr);
        
        if (hasWorkout) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else if (isSameDay(checkDate, new Date())) {
            // Allow skipping today if checking midday
            checkDate = subDays(checkDate, 1);
        } else {
            break;
        }
    }
    return streak;
  }, [userLogs]);

  // 5. Chart Data Generation
  const chartData = useMemo(() => {
    const today = new Date();
    let dataMap = [];

    const getVolForDate = (dateObj) => {
      const logs = userLogs.filter(l => isSameDay(parseISO(l.date), dateObj));
      return logs.reduce((acc, log) => acc + calculateVolume(log), 0);
    };

    if (graphRange === '1W') {
      const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
      dataMap = days.map(day => ({ date: format(day, 'EEE'), volume: getVolForDate(day) }));
    } else if (graphRange === '1M') {
      const days = eachDayOfInterval({ start: subDays(today, 29), end: today });
      dataMap = days.map(day => ({ date: format(day, 'dd'), volume: getVolForDate(day) }));
    } else if (graphRange === '1Y') {
      const startMonth = subMonthsFn(today, 11);
      const months = eachMonthOfInterval({ start: startMonth, end: today });
      dataMap = months.map(monthStart => {
        const logsInMonth = userLogs.filter(log => isSameMonth(parseISO(log.date), monthStart));
        const totalVol = logsInMonth.reduce((acc, log) => acc + calculateVolume(log), 0);
        return { date: format(monthStart, 'MMM'), volume: totalVol };
      });
    }
    return dataMap;
  }, [userLogs, graphRange]);

  // 6. Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const getWorkoutsForDay = (day) => userLogs.filter(log => isSameDay(parseISO(log.date), day));

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* ---------------------------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back, {userName} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your consistency.</p>
        </div>
        
        {/* Streak Card */}
        <div className="bg-orange-50 dark:bg-orange-900/20 px-6 py-3 rounded-2xl flex items-center gap-4 border border-orange-100 dark:border-orange-900/30">
          <div className="bg-orange-500 text-white p-2 rounded-full shadow-lg shadow-orange-200 dark:shadow-none">
            <Flame size={24} fill="white" />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-400 uppercase">Current Streak</p>
            <p className="text-2xl font-black text-gray-800 dark:text-white">{currentStreak} <span className="text-sm text-gray-400">Days</span></p>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* STATS CARDS */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          icon={Dumbbell} 
          color="text-blue-600 dark:text-blue-400" 
          bgColor="bg-blue-100 dark:bg-blue-900/30" 
          label="Total Sessions" 
          value={totalWorkouts} 
        />
        <StatCard 
          icon={Activity} 
          color="text-purple-600 dark:text-purple-400" 
          bgColor="bg-purple-100 dark:bg-purple-900/30" 
          label="Volume Lifted" 
          value={`${(totalVolume/1000).toFixed(1)}k kg`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ---------------------------------------------------------------------- */}
        {/* CHART SECTION */}
        {/* ---------------------------------------------------------------------- */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Volume Progress</h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex gap-1">
              {['1W', '1M', '1Y'].map(r => (
                <button 
                  key={r} 
                  onClick={() => setGraphRange(r)} 
                  className={clsx(
                    "px-3 py-1 text-sm font-semibold rounded-md transition", 
                    graphRange === r 
                      ? "bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-300" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff' 
                  }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* No Data Overlay */}
            {chartData.every(d => d.volume === 0) && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm z-10 rounded-xl">
                    <div className="text-center">
                        <Activity className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
                        <p className="text-gray-500 dark:text-gray-400 font-bold">No data yet</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Log your first workout to see the graph!</p>
                    </div>
                 </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CALENDAR SECTION */}
        {/* ---------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"><ChevronLeft size={20}/></button>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"><ChevronRight size={20}/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-400 dark:text-gray-500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((day, idx) => {
              const dayWorkouts = getWorkoutsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const hasWorkout = dayWorkouts.length > 0;
              
              return (
                <div 
                  key={idx}
                  onClick={() => hasWorkout && navigate('/history')}
                  className={clsx(
                    "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition relative group",
                    !isCurrentMonth && "text-gray-300 dark:text-gray-700",
                    isCurrentMonth && !hasWorkout && "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                    hasWorkout && "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none cursor-pointer hover:scale-105"
                  )}
                >
                  {format(day, 'd')}
                  {hasWorkout && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 dark:bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                      {dayWorkouts.map(w => w.name).join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component: Stat Card
const StatCard = ({ icon: Icon, color, bgColor, label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition hover:-translate-y-1">
    <div className={`p-4 ${bgColor} ${color} rounded-xl`}><Icon size={24} /></div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

export default Dashboard;