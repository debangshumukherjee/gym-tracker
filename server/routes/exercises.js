/** @format */

const express = require("express");
const router = express.Router();

// Import Controllers
const {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------------------
// EXERCISE ROUTES (All Protected)
// -----------------------------------------------------------------------------

// Get all exercises (Global + User Custom)
router.get("/", protect, getExercises);

// Create a new custom exercise
router.post("/", protect, createExercise);

// Update a custom exercise (ID required)
router.put("/:id", protect, updateExercise);

// Delete a custom exercise (ID required)
router.delete("/:id", protect, deleteExercise);

module.exports = router;
