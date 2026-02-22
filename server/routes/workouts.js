/** @format */

const express = require("express");
const router = express.Router();

const {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateExerciseLog,
  deleteExerciseLog,
  getLatestWorkout,
} = require("../controllers/workoutController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/latest", protect, getLatestWorkout);
router.delete("/:id", protect, deleteWorkout);
router.delete("/:id/exercises/:logId", protect, deleteExerciseLog);
router.put("/:id/exercises/:logId", protect, updateExerciseLog);

module.exports = router;
