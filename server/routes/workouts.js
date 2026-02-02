/** @format */

const express = require("express");
const router = express.Router();

// Import Controllers
const {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateExerciseLog,
  deleteExerciseLog,
  getLatestWorkout,
} = require("../controllers/workoutController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------------------
// WORKOUT SESSION ROUTES (All Protected)
// -----------------------------------------------------------------------------

// Create (or Merge) a workout session
router.post("/", protect, createWorkout);

// Get all past workout sessions
router.get("/", protect, getWorkouts);

// Get the most recent workout (for "Log Workout" pre-filling)
router.get("/latest", protect, getLatestWorkout);

// Delete an entire workout session
router.delete("/:id", protect, deleteWorkout);

// -----------------------------------------------------------------------------
// INDIVIDUAL EXERCISE LOG ROUTES
// -----------------------------------------------------------------------------

// Delete a specific exercise log from a session
router.delete("/:id/exercises/:logId", protect, deleteExerciseLog);

// Update a specific exercise log (Sets, Reps, Cardio data)
router.put("/:id/exercises/:logId", protect, updateExerciseLog);

module.exports = router;
