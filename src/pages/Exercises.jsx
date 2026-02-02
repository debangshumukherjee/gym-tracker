import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Dumbbell, Loader2, X, TrendingUp, Calendar, 
  Trophy, Timer, Edit2, Trash2, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { API_URL } from '../config';

// --- CONSTANTS ---
const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Cardio', 'Other'];
const BODY_PARTS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Cardio", "Other"];

const Exercises = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  
  // Data State
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // UI State (Filters)
  const [term, setTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editExerciseData, setEditExerciseData] = useState(null); 
  const [selectedExercise, setSelectedExercise] = useState(null); 
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, title: "", message: "", onConfirm: null 
  });

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Safely parse user data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
            const user = JSON.parse(userStr);
            setCurrentUserId(user.id);
        } catch (e) { 
            // Silent fail for user parsing
        }
      }

      const res = await fetch(`${API_URL}/api/exercises`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      console.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // 1. Request Delete (Opens Confirmation Modal)
  const requestDelete = (id, e) => {
    e.stopPropagation(); 
    setConfirmModal({
        isOpen: true,
        title: "Delete Exercise?",
        message: "Are you sure you want to delete this custom exercise? This action cannot be undone.",
        onConfirm: () => executeDelete(id)
    });
  };

  // 2. Execute Delete (API Call)
  const executeDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/exercises/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        setExercises(prev => prev.filter(ex => ex.id !== id));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting exercise");
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Open Edit Modal
  const openEdit = (ex, e) => {
      e.stopPropagation();
      setEditExerciseData(ex);
  };

  // Filter Logic
  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(term.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ex.bodyPart === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Exercise Library</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Click any exercise to see your progress.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Plus size={20} /> New Exercise
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for an exercise..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition shadow-sm text-gray-800 dark:text-white"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border
                ${selectedCategory === cat 
                  ? 'bg-gray-800 dark:bg-blue-600 text-white border-gray-800 dark:border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* EXERCISE LIST */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((ex) => {
             const isCardio = ex.bodyPart === 'Cardio' || ex.type === 'cardio';
             const isCustom = !!ex.userId;

             return (
              <div 
                key={ex.id} 
                onClick={() => setSelectedExercise(ex)} 
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-blue-400 dark:hover:border-blue-500 hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900/30 transition shadow-sm text-left w-full relative cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isCardio ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'}`}>
                    <div className="group-hover:hidden">
                        {isCardio ? <Timer size={20} /> : <Dumbbell size={20} />}
                    </div>
                    <div className="hidden group-hover:block animate-bounce"><TrendingUp size={20} /></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition flex items-center gap-2">
                        {ex.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-md uppercase tracking-wide border ${isCardio ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}>
                      {ex.bodyPart}
                    </span>
                  </div>
                </div>
                
                {/* ACTIONS & BADGE */}
                <div className="flex items-center gap-2">
                    {isCustom && (
                        <>
                           <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                                CUSTOM
                           </span>
                           <div className="flex gap-1 pl-2 border-l border-gray-100 dark:border-gray-700">
                                <div onClick={(e) => openEdit(ex, e)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer transition">
                                    <Edit2 size={16} />
                                </div>
                                <div onClick={(e) => requestDelete(ex.id, e)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer transition">
                                    <Trash2 size={16} />
                                </div>
                           </div>
                        </>
                    )}
                </div>
              </div>
            );
          })}
          
          {filtered.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <Dumbbell size={40} className="mb-2 opacity-20" />
                <p>No exercises found.</p>
             </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------------------------- */}
      
      {/* Create/Edit Modal */}
      {(showCreateModal || editExerciseData) && (
        <CreateExerciseModal 
          initialData={editExerciseData} 
          isEditMode={!!editExerciseData}
          onClose={() => {
              setShowCreateModal(false);
              setEditExerciseData(null);
          }} 
          onSuccess={(newEx) => {
            if (editExerciseData) {
                setExercises(exercises.map(e => e.id === newEx.id ? newEx : e));
            } else {
                setExercises([...exercises, newEx]);
            }
            setShowCreateModal(false);
            setEditExerciseData(null);
          }} 
        />
      )}

      {/* Statistics Modal */}
      {selectedExercise && (
        <ExerciseStatsModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

/**
 * Reusable Confirmation Modal
 */
const ConfirmationModal = ({ isOpen, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in transition-all">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="text-red-500 dark:text-red-400" size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">{message}</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="py-3 px-4 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition border border-gray-200 dark:border-gray-600">Cancel</button>
                    <button onClick={onConfirm} className="py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition">Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal for Creating or Editing Exercises
 */
const CreateExerciseModal = ({ onClose, onSuccess, initialData, isEditMode }) => {
    const [formData, setFormData] = useState({ 
      name: initialData?.name || "", 
      bodyPart: initialData?.bodyPart || "Chest", 
      type: initialData?.type || "strength" 
    });
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const payload = { ...formData, type: formData.bodyPart === 'Cardio' ? 'cardio' : 'strength' };
      try {
        const token = localStorage.getItem('token');
        const url = isEditMode ? `${API_URL}/api/exercises/${initialData.id}` : `${API_URL}/api/exercises`;
        const method = isEditMode ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) onSuccess(data); else alert("Failed: " + data.message);
      } catch (err) { alert("Error saving exercise"); } finally { setLoading(false); }
    };
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fade-in border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{isEditMode ? 'Edit Exercise' : 'Create Exercise'}</h2>
            <button onClick={onClose}><X className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Exercise Name</label>
              <input required autoFocus className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Body Part</label>
              <select className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white" value={formData.bodyPart} onChange={e => setFormData({...formData, bodyPart: e.target.value})}>
                {BODY_PARTS.map(bp => <option key={bp} value={bp}>{bp}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? "Save Changes" : "Create Exercise")}
            </button>
          </form>
        </div>
      </div>
    );
};
  
/**
 * Modal for Viewing Exercise Statistics & Charts
 */
const ExerciseStatsModal = ({ exercise, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const isCardio = exercise.bodyPart === 'Cardio' || exercise.type === 'cardio';
    
    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/workouts`, { headers: { Authorization: `Bearer ${token}` } });
          const allWorkouts = await res.json();
          
          const stats = allWorkouts.map(workout => {
              const log = workout.exercises.find(e => e.exerciseId === exercise.id);
              if (!log) return null;
              
              let val = 0;
              if (isCardio) val = log.cardioDistance || log.cardioTime || 0;
              else val = log.sets && log.sets.length > 0 ? Math.max(...log.sets.map(s => s.weight)) : 0;
              
              return { date: workout.date, displayDate: format(parseISO(workout.date), 'MMM d'), value: val };
            }).filter(Boolean).reverse();
            
          setHistory(stats);
        } catch (err) { 
            console.error("Failed to load stats"); 
        } finally { 
            setLoading(false); 
        }
      };
      fetchHistory();
    }, [exercise.id, isCardio]);

    const personalBest = history.length > 0 ? Math.max(...history.map(h => h.value)) : 0;
    const recentValue = history.length > 0 ? history[history.length - 1].value : 0;
    const unitLabel = isCardio ? 'km (or min)' : 'kg';

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-700/50">
            <div><h2 className="text-2xl font-bold text-gray-800 dark:text-white">{exercise.name}</h2><p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1"><TrendingUp size={14} /> Progress Analysis</p></div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"><X size={20} className="text-gray-500 dark:text-gray-400" /></button>
          </div>
          <div className="p-6 overflow-y-auto">
            {loading ? <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div> : history.length === 0 ? <div className="text-center py-10 text-gray-400 dark:text-gray-500"><Calendar size={48} className="mx-auto mb-3 opacity-20" /><p>No history found.</p></div> : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider"><Trophy size={14} /> Personal Record</div>
                    <div className="text-2xl font-black text-gray-800 dark:text-white">{personalBest} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{unitLabel}</span></div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center gap-2 mb-1 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider"><TrendingUp size={14} /> Latest</div>
                    <div className="text-2xl font-black text-gray-800 dark:text-white">{recentValue} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{unitLabel}</span></div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="displayDate" stroke="#9ca3af" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#9ca3af" tick={{fontSize: 11}} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }} 
                        labelStyle={{ fontWeight: 'bold', color: '#fff' }} 
                        formatter={(value) => [`${value} ${unitLabel}`, isCardio ? 'Distance/Time' : 'Max Weight']} 
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default Exercises;