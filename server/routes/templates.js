/** @format */

const express = require("express");
const router = express.Router();

const {
  createTemplate,
  getTemplates,
  deleteTemplate,
} = require("../controllers/templateController");

const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, createTemplate);
router.get("/", protect, getTemplates);
router.delete("/:id", protect, deleteTemplate);

module.exports = router;
