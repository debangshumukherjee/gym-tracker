/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { userId: null }, // Global Exercises
          { userId: { isSet: false } },
          { userId: req.user.id }, // Custom user exercises
        ],
      },
      orderBy: { name: "asc" },
    });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises" });
  }
};

// Create custom exercise
exports.createExercise = async (req, res) => {
  try {
    const { name, bodyPart, type } = req.body;

    const exercise = await prisma.exercise.create({
      data: { name, bodyPart, type, userId: req.user.id },
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Error creating exercise" });
  }
};

// Update custom exercise
exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bodyPart, type } = req.body;

    const existing = await prisma.exercise.findUnique({ where: { id } });

    // Authorization Check: Ensure user owns this exercise
    if (!existing || existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own custom exercises" });
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: { name, bodyPart, type },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating exercise" });
  }
};

// Delete custom exercise
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.exercise.findUnique({ where: { id } });

    // Authorization Check: Ensure user owns this exercise
    if (!existing || existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own custom exercises" });
    }

    // Safety Check: Prevent deletion if exercise has history data
    const usageCount = await prisma.workoutLog.count({
      where: { exerciseId: id },
    });
    if (usageCount > 0) {
      return res
        .status(400)
        .json({
          message:
            "Cannot delete this exercise because it is used in your workout history.",
        });
    }

    await prisma.exercise.delete({ where: { id } });

    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exercise" });
  }
};
