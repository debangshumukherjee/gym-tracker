/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create new workout template
exports.createTemplate = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, exercises } = req.body;

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Invalid exercises data" });
    }

    const template = await prisma.template.create({
      data: {
        userId: req.user.id,
        name,
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets ? ex.sets.length : 3,
          reps: 10,
        })),
      },
    });

    res.status(201).json(template);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save template", error: error.message });
  }
};

// Get user templates
exports.getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;

    const templates = await prisma.template.findMany({ where: { userId } });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.template.delete({ where: { id } });

    res.json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting template" });
  }
};
