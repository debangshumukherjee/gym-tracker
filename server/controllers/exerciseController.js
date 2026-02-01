const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 1. GET EXERCISES
 * Fetches Global exercises (system default) AND Custom exercises created by the logged-in user.
 */
exports.getExercises = async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { userId: null },            // 1. Global Exercises (System default)
          { userId: { isSet: false } }, // Handle potential MongoDB unset fields
          { userId: req.user.id }      // 2. Custom exercises created by THIS user
        ]
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises" });
  }
};

/**
 * 2. CREATE EXERCISE
 * Creates a new custom exercise for the logged-in user.
 */
exports.createExercise = async (req, res) => {
  try {
    const { name, bodyPart, type } = req.body;
    
    const exercise = await prisma.exercise.create({
      data: {
        name,
        bodyPart,
        type,
        userId: req.user.id
      }
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Error creating exercise" });
  }
};

/**
 * 3. UPDATE EXERCISE
 * Updates a custom exercise. Users can only update their own exercises.
 */
exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bodyPart, type } = req.body;
    
    const existing = await prisma.exercise.findUnique({ where: { id } });
    
    // Authorization Check: Ensure user owns this exercise
    if (!existing || existing.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only edit your own custom exercises" });
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: { name, bodyPart, type }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating exercise" });
  }
};

/**
 * 4. DELETE EXERCISE
 * Deletes a custom exercise. Prevents deletion if the exercise is used in past workouts.
 */
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.exercise.findUnique({ where: { id } });

    // Authorization Check: Ensure user owns this exercise
    if (!existing || existing.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own custom exercises" });
    }

    // Safety Check: Prevent deletion if exercise has history data
    const usageCount = await prisma.workoutLog.count({ where: { exerciseId: id } });
    if (usageCount > 0) {
        return res.status(400).json({ message: "Cannot delete this exercise because it is used in your workout history." });
    }

    await prisma.exercise.delete({ where: { id } });
    
    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exercise" });
  }
};