const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 1. SAVE A NEW TEMPLATE
 * Validates input and creates a workout template for the user.
 */
exports.createTemplate = async (req, res) => {
  try {
    // 1. Check User Authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2. Validate Request Body
    const { name, exercises } = req.body;

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Invalid exercises data" });
    }

    // 3. Save to Database
    // Note: Preserves specific logic mapping sets length and hardcoded reps
    const template = await prisma.template.create({
      data: {
        userId: req.user.id,
        name,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets ? ex.sets.length : 3, 
          reps: 10 
        }))
      }
    });

    res.status(201).json(template);

  } catch (error) {
    console.error("Create Template Error:", error);
    res.status(500).json({ message: "Failed to save template", error: error.message });
  }
};

/**
 * 2. GET ALL TEMPLATES
 * Fetches all templates belonging to the authenticated user.
 */
exports.getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const templates = await prisma.template.findMany({
      where: { userId }
    });

    res.json(templates);
  } catch (error) {
    console.error("Get Templates Error:", error);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};

/**
 * 3. DELETE TEMPLATE
 * Removes a specific template by ID.
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.template.delete({ where: { id } });
    
    res.json({ message: "Template deleted" });
  } catch (error) {
    console.error("Delete Template Error:", error);
    res.status(500).json({ message: "Error deleting template" });
  }
};