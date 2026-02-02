/** @format */

import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Search,
  Trash2,
  Dumbbell,
  Copy,
  FolderPlus,
  FolderOpen,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Flame,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const LogWorkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  // Workout Data
  const [workoutName, setWorkoutName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  // UI States
  const [showSelector, setShowSelector] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Data for Modals
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Search & Filter
  const [allExercises, setAllExercises] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filters = [
    "All",
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Triceps",
    "Biceps",
    "Abs",
    "Cardio",
  ];

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [exRes, tempRes] = await Promise.all([
          fetch(`${API_URL}/api/exercises`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/templates`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (exRes.ok) setAllExercises(await exRes.json());
        if (tempRes.ok) setTemplates(await tempRes.json());
      } catch (err) {
        showToast("Failed to load data", "error");
      }
    };
    fetchData();
  }, []);

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
  // EXERCISE LOGIC
  // ---------------------------------------------------------------------------

  const addExercise = (exercise) => {
    const newExercise = {
      uniqueId: Date.now() + Math.random(),
      exerciseId: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      type:
        exercise.type ||
        (exercise.bodyPart === "Cardio" ? "cardio" : "strength"),
      sets: [{ setNumber: 1, weight: "", reps: "" }],
      cardioTime: "",
      cardioDistance: "",
      cardioCalories: "",
      cardioIncline: "",
      cardioSpeed: "",
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowSelector(false);
    setSearchTerm("");
    setSelectedFilter("All");
    showToast("Exercise added");
  };

  const removeExercise = (uniqueId) => {
    setSelectedExercises(
      selectedExercises.filter((ex) => ex.uniqueId !== uniqueId),
    );
  };

  // Update Strength Sets
  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setSelectedExercises(updated);
  };

  // Update Cardio Fields (Directly on exercise object)
  const updateCardioData = (exerciseIndex, field, value) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex][field] = value;
    setSelectedExercises(updated);
  };

  const addSet = (exerciseIndex) => {
    const updated = [...selectedExercises];
    const newSetNum = updated[exerciseIndex].sets.length + 1;
    updated[exerciseIndex].sets.push({
      setNumber: newSetNum,
      weight: "",
      reps: "",
    });
    setSelectedExercises(updated);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    updated[exerciseIndex].sets.forEach((set, i) => (set.setNumber = i + 1));
    setSelectedExercises(updated);
  };

  // ---------------------------------------------------------------------------
  // FEATURES (Copy, Templates)
  // ---------------------------------------------------------------------------

  const handleCopyPrevious = async () => {
    if (
      selectedExercises.length > 0 &&
      !window.confirm("Replace current exercises?")
    )
      return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/workouts/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setWorkoutName(data.name || "Copied Workout");
        setSelectedExercises(data.exercises);
        showToast("Last workout copied!");
      } else {
        showToast("No previous workout found", "error");
      }
    } catch (err) {
      showToast("Failed to copy", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- TEMPLATE SAVING ---
  const openSaveModal = () => {
    if (selectedExercises.length === 0) {
      showToast("Add exercises before saving!", "error");
      return;
    }
    setTemplateNameInput("");
    setShowSaveModal(true);
  };

  const confirmSaveTemplate = async () => {
    if (!templateNameInput.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: templateNameInput,
          exercises: selectedExercises,
        }),
      });

      if (res.ok) {
        const newTemp = await res.json();
        setTemplates([...templates, newTemp]);
        showToast("Template saved successfully!");
        setShowSaveModal(false);
      } else {
        showToast("Failed to save template", "error");
      }
    } catch (err) {
      showToast("Server connection error", "error");
    }
  };

  // --- TEMPLATE LOADING ---
  const handleLoadTemplate = (template) => {
    if (
      selectedExercises.length > 0 &&
      !window.confirm("Replace current exercises?")
    )
      return;

    const loaded = template.exercises
      .map((tempEx) => {
        const original = allExercises.find((e) => e.id === tempEx.exerciseId);
        if (!original) return null;
        return {
          uniqueId: Date.now() + Math.random(),
          exerciseId: original.id,
          name: original.name,
          bodyPart: original.bodyPart,
          type:
            original.type ||
            (original.bodyPart === "Cardio" ? "cardio" : "strength"),
          sets: Array(tempEx.sets || 3)
            .fill(0)
            .map((_, i) => ({ setNumber: i + 1, weight: "", reps: "" })),
          cardioTime: "",
          cardioDistance: "",
          cardioCalories: "",
        };
      })
      .filter(Boolean);

    setSelectedExercises(loaded);
    setWorkoutName(template.name);
    setShowTemplates(false);
    showToast(`Loaded "${template.name}"`);
  };

  // --- TEMPLATE DELETING ---
  const promptDeleteTemplate = (e, template) => {
    e.stopPropagation(); // Prevent loading the template when clicking delete
    setTemplateToDelete(template);
    setShowDeleteConfirm(true);
    setShowTemplates(false); // Close dropdown
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/templates/${templateToDelete.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.ok) {
        setTemplates(templates.filter((t) => t.id !== templateToDelete.id));
        showToast("Template deleted successfully");
        setShowDeleteConfirm(false);
        setTemplateToDelete(null);
      } else {
        showToast("Failed to delete template", "error");
      }
    } catch (e) {
      showToast("Error deleting template", "error");
    }
  };

  // --- SUBMIT WORKOUT ---
  const handleSubmit = async () => {
    if (selectedExercises.length === 0)
      return showToast("Add at least one exercise!", "error");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: workoutName,
          date,
          exercises: selectedExercises,
        }),
      });
      if (res.ok) {
        showToast("Workout Logged Successfully!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      showToast("Failed to log workout", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className='max-w-3xl mx-auto space-y-6 pb-24 animate-fade-in relative'>
      {/* HEADER SECTION */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
          Log Workout
        </h1>

        {/* Actions Bar */}
        <div className='flex flex-wrap gap-2 mb-6'>
          <button
            onClick={handleCopyPrevious}
            className='flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition'
          >
            <Copy size={16} /> Copy Last
          </button>

          <div className='relative'>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className='flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition'
            >
              <FolderOpen size={16} /> Load Template
            </button>
            {showTemplates && (
              <div className='absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden z-20'>
                {templates.length === 0 ? (
                  <div className='p-3 text-xs text-gray-400'>No templates</div>
                ) : (
                  templates.map((t) => (
                    <div
                      key={t.id}
                      className='w-full flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0 pr-3'
                    >
                      <button
                        onClick={() => handleLoadTemplate(t)}
                        className='flex-1 text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200'
                      >
                        {t.name}
                      </button>
                      <button
                        onClick={(e) => promptDeleteTemplate(e, t)}
                        className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition'
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={openSaveModal}
            className='flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition'
          >
            <FolderPlus size={16} /> Save as Template
          </button>
        </div>

        {/* Input Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='text'
            placeholder='Workout Name'
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className='w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl outline-none'
          />
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl outline-none'
          />
        </div>
      </div>

      {/* EXERCISE LIST */}
      <div className='space-y-4'>
        {selectedExercises.map((exercise, exIndex) => {
          const isCardio =
            exercise.bodyPart === "Cardio" || exercise.type === "cardio";

          return (
            <div
              key={exercise.uniqueId}
              className='bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='font-bold text-gray-800 dark:text-white text-lg'>
                    {exercise.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${isCardio ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "text-gray-400 bg-gray-50 dark:bg-gray-700"}`}
                  >
                    {exercise.bodyPart}
                  </span>
                </div>
                <button
                  onClick={() => removeExercise(exercise.uniqueId)}
                  className='text-red-400 hover:text-red-600'
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* --- CONDITIONAL RENDERING: CARDIO vs STRENGTH --- */}
              {isCardio ? (
                // CARDIO INPUTS
                <div className='grid grid-cols-3 gap-3 mt-4'>
                  <div className='space-y-1'>
                    <label className='text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1'>
                      <Clock size={10} /> Time
                    </label>
                    <input
                      type='number'
                      placeholder='min'
                      value={exercise.cardioTime}
                      onChange={(e) =>
                        updateCardioData(exIndex, "cardioTime", e.target.value)
                      }
                      className='w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl text-center font-bold outline-none focus:border-blue-500'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label className='text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1'>
                      <MapPin size={10} /> Dist
                    </label>
                    <input
                      type='number'
                      placeholder='km'
                      value={exercise.cardioDistance}
                      onChange={(e) =>
                        updateCardioData(
                          exIndex,
                          "cardioDistance",
                          e.target.value,
                        )
                      }
                      className='w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl text-center font-bold outline-none focus:border-blue-500'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label className='text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1'>
                      <Flame size={10} /> Cals
                    </label>
                    <input
                      type='number'
                      placeholder='kcal'
                      value={exercise.cardioCalories}
                      onChange={(e) =>
                        updateCardioData(
                          exIndex,
                          "cardioCalories",
                          e.target.value,
                        )
                      }
                      className='w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl text-center font-bold outline-none focus:border-blue-500'
                    />
                  </div>
                </div>
              ) : (
                // STRENGTH SETS
                <div className='space-y-2'>
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className='grid grid-cols-6 gap-2 items-center'
                    >
                      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs font-bold mx-auto'>
                        {set.setNumber}
                      </div>
                      <input
                        type='number'
                        placeholder='kg'
                        className='col-span-2 p-2 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-center text-sm'
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(exIndex, setIndex, "weight", e.target.value)
                        }
                      />
                      <input
                        type='number'
                        placeholder='reps'
                        className='col-span-2 p-2 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-center text-sm'
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(exIndex, setIndex, "reps", e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeSet(exIndex, setIndex)}
                        className='col-span-1 flex justify-center text-gray-300 hover:text-red-500'
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addSet(exIndex)}
                    className='w-full py-2 mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-1'
                  >
                    <Plus size={14} /> Add Set
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setShowSelector(true)}
          className='w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-bold hover:border-blue-500 hover:text-blue-500 transition flex flex-col items-center justify-center gap-2'
        >
          <Dumbbell size={24} /> Add Exercise
        </button>
      </div>

      {/* FINISH BUTTON */}
      <div className='fixed bottom-6 left-0 right-0 px-4 flex justify-center z-10'>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='bg-gray-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black dark:hover:bg-blue-700 transition flex items-center gap-3 w-full max-w-md justify-center'
        >
          {loading ? <Loader2 className='animate-spin' /> : <Save size={20} />}{" "}
          Finish Workout
        </button>
      </div>

      {/* --- MODALS & ALERTS --- */}

      {/* Toast Notification */}
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

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in duration-200'>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-2'>
              Save as Template
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Give your routine a name so you can use it later.
            </p>

            <input
              autoFocus
              type='text'
              placeholder='e.g. Leg Day'
              value={templateNameInput}
              onChange={(e) => setTemplateNameInput(e.target.value)}
              className='w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none mb-4 dark:text-white'
            />

            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowSaveModal(false)}
                className='px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveTemplate}
                disabled={!templateNameInput.trim()}
                className='px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Template Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in duration-200 border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4 text-red-600'>
              <div className='bg-red-100 dark:bg-red-900/30 p-2 rounded-full'>
                <AlertTriangle size={24} />
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                Delete Template?
              </h3>
            </div>

            <p className='text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed'>
              Are you sure you want to delete{" "}
              <span className='font-bold text-gray-800 dark:text-white'>
                "{templateToDelete?.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTemplate}
                className='flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Selector Modal */}
      {showSelector && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700 space-y-3'>
              <div className='flex gap-2 items-center'>
                <Search className='text-gray-400' />
                <input
                  autoFocus
                  placeholder='Search...'
                  className='w-full outline-none text-lg bg-transparent dark:text-white'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setShowSelector(false)}>
                  <X size={24} className='text-gray-400' />
                </button>
              </div>
              <div className='flex gap-2 overflow-x-auto pb-1 no-scrollbar'>
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedFilter === filter ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className='overflow-y-auto p-2 space-y-1'>
              {allExercises
                .filter(
                  (e) =>
                    e.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedFilter === "All" || e.bodyPart === selectedFilter),
                )
                .map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise)}
                    className='w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl flex justify-between items-center group transition-colors'
                  >
                    <div>
                      <h4 className='font-bold text-gray-800 dark:text-white'>
                        {exercise.name}
                      </h4>
                      <p className='text-xs text-gray-400'>
                        {exercise.bodyPart}
                      </p>
                    </div>
                    <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white'>
                      <Plus size={18} />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogWorkout;
