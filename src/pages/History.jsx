/** @format */

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Calendar,
  Loader2,
  TrendingUp,
  X,
  Trophy,
  Timer,
  Edit2,
  Save,
  Plus,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  Activity,
} from "lucide-react";
import { format, parseISO, isToday, isYesterday } from "date-fns";
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

// -----------------------------------------------------------------------------
// MAIN COMPONENT: History
// -----------------------------------------------------------------------------
const History = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [statsModalData, setStatsModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);

  // Alert/Confirmation State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: null,
  });

  // --- DATA FETCHING ---
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setWorkouts(data);
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- HANDLERS ---

  const requestDeleteSession = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Session?",
      message:
        "This will permanently remove this entire workout and all its data.",
      type: "danger",
      onConfirm: () => deleteSession(id),
    });
  };

  const deleteSession = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/workouts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const requestDeleteExercise = (workoutId, logId) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Exercise?",
      message: "Are you sure you want to remove this exercise from the log?",
      type: "danger",
      onConfirm: () => deleteExercise(workoutId, logId),
    });
  };

  const deleteExercise = async (workoutId, logId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/workouts/${workoutId}/exercises/${logId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await res.json();
      if (res.ok) {
        if (data.isEmpty) {
          setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
        } else {
          setWorkouts((prev) =>
            prev.map((w) => {
              if (w.id === workoutId) {
                return {
                  ...w,
                  exercises: w.exercises.filter((ex) => ex.id !== logId),
                };
              }
              return w;
            }),
          );
        }
      }
    } catch (err) {
      alert("Failed to delete exercise");
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Group Workouts Helper
  const groupWorkoutsByDate = (list) => {
    const groups = {};
    list.forEach((workout) => {
      const dateKey = format(parseISO(workout.date), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(workout);
    });
    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]) - new Date(a[0]),
    );
  };

  const groupedHistory = groupWorkoutsByDate(workouts);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='animate-spin text-blue-600' size={32} />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 p-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
          History
        </h1>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          <span className='font-bold text-gray-800 dark:text-white'>
            {workouts.length}
          </span>{" "}
          Sessions
        </div>
      </div>

      {/* List Content */}
      {workouts.length === 0 ? (
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors'>
          <Calendar
            className='mx-auto text-gray-300 dark:text-gray-600 mb-3'
            size={48}
          />
          <p className='text-gray-500 dark:text-gray-400'>
            No workouts logged yet.
          </p>
        </div>
      ) : (
        groupedHistory.map(([dateKey, sessionList]) => (
          <div key={dateKey} className='space-y-3'>
            {/* Sticky Date Header */}
            <h2 className='text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 z-10 transition-colors'>
              <Calendar size={14} />
              {isToday(parseISO(dateKey))
                ? "Today"
                : isYesterday(parseISO(dateKey))
                  ? "Yesterday"
                  : format(parseISO(dateKey), "EEEE, MMMM do")}
            </h2>

            {/* Session Cards (Accordion Style) */}
            <div className='grid gap-3'>
              {sessionList.map((workout) => (
                <WorkoutSessionCard
                  key={workout.id}
                  workout={workout}
                  onDeleteSession={() => requestDeleteSession(workout.id)}
                  onDeleteExercise={(logId) =>
                    requestDeleteExercise(workout.id, logId)
                  }
                  onEdit={(log) =>
                    setEditModalData({ ...log, workoutId: workout.id })
                  }
                  onStats={(log) =>
                    setStatsModalData({
                      id: log.exerciseId,
                      name: log.exercise?.name,
                      type:
                        log.exercise?.bodyPart === "Cardio" ||
                        log.exercise?.type === "cardio"
                          ? "cardio"
                          : "strength",
                    })
                  }
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* --- MODALS --- */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />

      {statsModalData && (
        <ExerciseStatsModal
          exercise={statsModalData}
          onClose={() => setStatsModalData(null)}
        />
      )}

      {editModalData && (
        <EditExerciseModal
          data={editModalData}
          onClose={() => setEditModalData(null)}
          onSuccess={() => {
            setEditModalData(null);
            fetchHistory();
          }}
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Workout Session Card (Accordion)
// -----------------------------------------------------------------------------
const WorkoutSessionCard = ({
  workout,
  onDeleteSession,
  onDeleteExercise,
  onEdit,
  onStats,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300'>
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'
      >
        <div className='flex items-center gap-4'>
          <div
            className={`p-3 rounded-full ${isOpen ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"} transition-colors`}
          >
            <Activity size={20} />
          </div>
          <div>
            <h3 className='font-bold text-gray-800 dark:text-white text-lg'>
              {workout.name || "Untitled Workout"}
            </h3>
            <div className='text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5'>
              <span>{workout.exercises?.length || 0} Exercises</span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* Delete Session Button (Stop Propagation prevents toggling) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession();
            }}
            className='text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition'
            title='Delete Session'
          >
            <Trash2 size={18} />
          </button>

          {/* Chevron Icon */}
          <div
            className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Accordion Body (Exercises) */}
      {isOpen && (
        <div className='border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 space-y-2 animate-fade-in'>
          {workout.exercises &&
            workout.exercises.map((log, i) => {
              const isCardio =
                log.exercise?.bodyPart === "Cardio" ||
                log.exercise?.type === "cardio";
              return (
                <div
                  key={i}
                  className='w-full flex items-center justify-between text-sm p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors'
                >
                  {/* Exercise Info (Clickable for Stats) */}
                  <div
                    onClick={() => onStats(log)}
                    className='flex items-center gap-3 cursor-pointer flex-1'
                  >
                    <div
                      className={`p-1.5 rounded-lg transition ${isCardio ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}
                    >
                      {isCardio ? (
                        <Timer size={14} />
                      ) : (
                        <TrendingUp size={14} />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors'>
                        {log.exercise?.name}
                      </span>
                      <div className='flex gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5'>
                        {isCardio ? (
                          <>
                            {log.cardioDistance > 0 && (
                              <span>{log.cardioDistance}km</span>
                            )}
                            {log.cardioTime > 0 && (
                              <span>{log.cardioTime}m</span>
                            )}
                            {!log.cardioDistance && !log.cardioTime && (
                              <span>Cardio</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span>{log.sets.length} Sets</span>
                            <span className='font-bold text-gray-800 dark:text-gray-300'>
                              {Math.max(...log.sets.map((s) => s.weight || 0))}
                              kg Max
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => onEdit(log)}
                      className='p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteExercise(log.id);
                      }}
                      className='p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// HELPER COMPONENT: Confirmation Modal
// -----------------------------------------------------------------------------
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  type = "danger",
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-scale-in border border-gray-100 dark:border-gray-700 transition-colors'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-3 rounded-full ${type === "danger" ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"}`}
          >
            {type === "danger" ? (
              <AlertCircle size={24} />
            ) : (
              <AlertTriangle size={24} />
            )}
          </div>
          <h3 className='text-lg font-bold text-gray-800 dark:text-white'>
            {title}
          </h3>
        </div>

        <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
          {message}
        </p>

        <div className='flex gap-3 pt-2'>
          <button
            onClick={onClose}
            className='flex-1 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-600'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-bold text-white transition shadow-lg dark:shadow-none ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 shadow-red-200"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
            }`}
          >
            {type === "danger" ? "Delete" : "Discard"}
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// HELPER COMPONENT: Edit Exercise Modal
// -----------------------------------------------------------------------------
const EditExerciseModal = ({ data, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isCardio =
    data.exercise?.bodyPart === "Cardio" || data.exercise?.type === "cardio";

  const [formData, setFormData] = useState({
    type: isCardio ? "cardio" : "strength",
    sets: data.sets || [],
    cardioTime: data.cardioTime || "",
    cardioDistance: data.cardioDistance || "",
    cardioSpeed: data.cardioSpeed || "",
    cardioIncline: data.cardioIncline || "",
    cardioCalories: data.cardioCalories || "",
  });

  const updateSet = (index, field, value) => {
    const newSets = [...formData.sets];
    newSets[index][field] = value;
    setFormData({ ...formData, sets: newSets });
  };

  const addSet = () => {
    const lastWeight =
      formData.sets.length > 0
        ? formData.sets[formData.sets.length - 1].weight
        : "";
    setFormData({
      ...formData,
      sets: [
        ...formData.sets,
        { setNumber: formData.sets.length + 1, weight: lastWeight, reps: "" },
      ],
    });
  };

  const removeSet = (index) => {
    const newSets = formData.sets
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, setNumber: i + 1 }));
    setFormData({ ...formData, sets: newSets });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/workouts/${data.workoutId}/exercises/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) onSuccess();
      else alert("Failed to update");
    } catch (e) {
      alert("Error updating");
    } finally {
      setLoading(false);
    }
  };

  const requestClose = () => setShowConfirm(true);

  return (
    <>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
        <div className='bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh] transition-colors'>
          <div className='p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50'>
            <h3 className='font-bold text-gray-800 dark:text-white'>
              Edit {data.exercise?.name}
            </h3>
            <button onClick={requestClose}>
              <X
                size={20}
                className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              />
            </button>
          </div>

          <div className='p-6 overflow-y-auto'>
            {isCardio ? (
              <div className='grid grid-cols-2 gap-4'>
                {["Time (m)", "Dist (km)", "Speed", "Calories"].map(
                  (label, i) => (
                    <div key={i} className='space-y-1'>
                      <label className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase'>
                        {label}
                      </label>
                      <input
                        type='number'
                        value={Object.values(formData)[i + 2]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [Object.keys(formData)[i + 2]]: e.target.value,
                          })
                        }
                        className='w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                      />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className='space-y-3'>
                <div className='grid grid-cols-10 gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase text-center'>
                  <div className='col-span-1'>#</div>
                  <div className='col-span-4'>kg</div>
                  <div className='col-span-4'>Reps</div>
                  <div className='col-span-1'></div>
                </div>
                {formData.sets.map((set, i) => (
                  <div key={i} className='grid grid-cols-10 gap-2 items-center'>
                    <div className='col-span-1 flex justify-center font-bold text-gray-500 dark:text-gray-400'>
                      {set.setNumber}
                    </div>
                    <div className='col-span-4'>
                      <input
                        type='number'
                        value={set.weight}
                        onChange={(e) => updateSet(i, "weight", e.target.value)}
                        className='w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-center font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                      />
                    </div>
                    <div className='col-span-4'>
                      <input
                        type='number'
                        value={set.reps}
                        onChange={(e) => updateSet(i, "reps", e.target.value)}
                        className='w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-center font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                      />
                    </div>
                    <div className='col-span-1 flex justify-center'>
                      <button
                        onClick={() => removeSet(i)}
                        className='text-red-400 dark:text-red-500 hover:text-red-600'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addSet}
                  className='w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-1'
                >
                  <Plus size={16} /> Add Set
                </button>
              </div>
            )}
          </div>

          <div className='p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-white dark:bg-gray-800'>
            <button
              onClick={requestClose}
              className='flex-1 py-3 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className='flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2'
            >
              {loading ? (
                <Loader2 className='animate-spin' size={20} />
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title='Unsaved Changes'
        message='You have unsaved edits. Discard changes?'
        type='warning'
        onClose={() => setShowConfirm(false)}
        onConfirm={onClose}
      />
    </>
  );
};

// -----------------------------------------------------------------------------
// HELPER COMPONENT: Exercise Stats Modal
// -----------------------------------------------------------------------------
const ExerciseStatsModal = ({ exercise, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isCardio =
    exercise.type === "cardio" ||
    (exercise.bodyPart && exercise.bodyPart === "Cardio");

  // Calculate Stats Logic
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/workouts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allWorkouts = await res.json();

        // Transform data for chart
        const stats = allWorkouts
          .map((workout) => {
            const log = workout.exercises.find(
              (e) => e.exerciseId === exercise.id,
            );
            if (!log) return null;
            let val = isCardio
              ? log.cardioDistance || log.cardioTime || 0
              : log.sets && log.sets.length > 0
                ? Math.max(...log.sets.map((s) => s.weight || 0))
                : 0;
            if (val === 0) return null;
            return {
              date: workout.date,
              displayDate: format(parseISO(workout.date), "MMM d"),
              value: val,
            };
          })
          .filter(Boolean)
          .reverse();
        setHistory(stats);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [exercise.id, isCardio]);

  const personalBest =
    history.length > 0 ? Math.max(...history.map((h) => h.value)) : 0;
  const recentVal = history.length > 0 ? history[history.length - 1].value : 0;
  const unit = isCardio ? "km" : "kg";

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors'>
        <div className='p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-700/50'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
              {exercise.name}
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1'>
              <TrendingUp size={14} /> Progress Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition'
          >
            <X size={20} className='text-gray-500 dark:text-gray-400' />
          </button>
        </div>
        <div className='p-6 overflow-y-auto'>
          {loading ? (
            <div className='h-40 flex items-center justify-center'>
              <Loader2 className='animate-spin text-blue-600' size={32} />
            </div>
          ) : history.length === 0 ? (
            <div className='text-center py-10 text-gray-400'>
              <TrendingUp className='mx-auto mb-3 opacity-20' size={48} />
              <p>No valid data points found.</p>
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30'>
                  <div className='flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider'>
                    <Trophy size={14} /> Personal Best
                  </div>
                  <div className='text-2xl font-black text-gray-800 dark:text-white'>
                    {personalBest}{" "}
                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      {unit}
                    </span>
                  </div>
                </div>
                <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30'>
                  <div className='flex items-center gap-2 mb-1 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider'>
                    <TrendingUp size={14} /> Latest
                  </div>
                  <div className='text-2xl font-black text-gray-800 dark:text-white'>
                    {recentVal}{" "}
                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      {unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className='h-64 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id='colorVal' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#2563eb'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='#2563eb'
                          stopOpacity={0}
                        />
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
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke='#9ca3af'
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                      labelStyle={{ fontWeight: "bold", color: "#fff" }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(value) => [`${value} ${unit}`, "Value"]}
                    />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#2563eb'
                      strokeWidth={3}
                      fillOpacity={1}
                      fill='url(#colorVal)'
                    />
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

export default History;
