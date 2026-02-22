/** @format */

const express = require("express");
const router = express.Router();

const {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");

const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, getExercises);
router.post("/", protect, createExercise);
router.put("/:id", protect, updateExercise);
router.delete("/:id", protect, deleteExercise);

module.exports = router;
