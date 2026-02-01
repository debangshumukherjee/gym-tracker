const express = require('express');
const router = express.Router();

// Import Controllers
const { 
  createTemplate, 
  getTemplates, 
  deleteTemplate 
} = require('../controllers/templateController');

// Import Middleware
const { protect } = require('../middleware/authMiddleware');

// -----------------------------------------------------------------------------
// TEMPLATE ROUTES (All Protected)
// -----------------------------------------------------------------------------

// Create a new workout template
router.post('/', protect, createTemplate);

// Get all templates for the logged-in user
router.get('/', protect, getTemplates);

// Delete a specific template by ID
router.delete('/:id', protect, deleteTemplate);

module.exports = router;