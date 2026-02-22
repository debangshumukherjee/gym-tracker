/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create or update workout
exports.createWorkout = async (req, res) => {
  try {
    let { name, exercises, date } = req.body;
    if (!name) name = "Daily Workout";

    const userId = req.user.id;

    const workoutDate = date ? new Date(date) : new Date();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dateOfBirth: true },
    });

    if (user.dateOfBirth) {
      const dob = new Date(user.dateOfBirth);
      const minAgeDate = new Date(dob);
      minAgeDate.setFullYear(dob.getFullYear() + 5);

      minAgeDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(workoutDate);
      compareDate.setHours(0, 0, 0, 0);

      if (compareDate < minAgeDate) {
        return res
          .status(400)
          .json({
            message: `You cannot log workouts before age 5. Earliest allowed date is ${minAgeDate.toDateString()}.`,
          });
      }
    }

    const startOfDay = new Date(workoutDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workoutDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check for existing workout on same day
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        userId: userId,
        date: { gte: startOfDay, lte: endOfDay },
        name: name,
      },
    });

    const newExercisesData = exercises.map((ex) => ({
      exerciseId: ex.exerciseId,

      sets: ex.sets
        ? ex.sets.map((s) => ({
            setNumber: s.setNumber,
            weight: parseFloat(s.weight) || 0,
            reps: parseFloat(s.reps) || 0,
          }))
        : [],

      cardioTime: parseFloat(ex.cardioTime) || null,
      cardioDistance: parseFloat(ex.cardioDistance) || null,
      cardioCalories: parseFloat(ex.cardioCalories) || null,
      cardioIncline: parseFloat(ex.cardioIncline) || null,
      cardioSpeed: parseFloat(ex.cardioSpeed) || null,
    }));

    let result;

    if (existingWorkout) {
      result = await prisma.workout.update({
        where: { id: existingWorkout.id },
        data: { exercises: { create: newExercisesData } },
        include: { exercises: true },
      });
    } else {
      result = await prisma.workout.create({
        data: {
          userId,
          name: name,
          date: workoutDate,
          exercises: { create: newExercisesData },
        },
        include: { exercises: true },
      });
    }

    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save workout", error: error.message });
  }
};

// Get workout history
exports.getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;

    const workouts = await prisma.workout.findMany({
      where: { userId: userId },
      include: { exercises: { include: { exercise: true } } },
      orderBy: { date: "desc" },
    });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// Delete workout and logs
exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete logs first (Manual cascade for Prisma Mongo)
    await prisma.workoutLog.deleteMany({ where: { workoutId: id } });

    await prisma.workout.delete({ where: { id } });

    res.json({ message: "Workout removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting workout" });
  }
};

// Delete exercise log
exports.deleteExerciseLog = async (req, res) => {
  try {
    const { id, logId } = req.params;

    await prisma.workoutLog.delete({ where: { id: logId } });

    // Check if workout is now empty
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: { exercises: true },
    });

    if (workout.exercises.length === 0) {
      await prisma.workout.delete({ where: { id } });
      return res.json({ message: "Empty workout deleted", isEmpty: true });
    }

    res.json({ message: "Exercise removed", isEmpty: false });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exercise" });
  }
};

// Update exercise log
exports.updateExerciseLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const {
      type,
      sets,
      cardioTime,
      cardioDistance,
      cardioCalories,
      cardioIncline,
      cardioSpeed,
    } = req.body;

    let updateData = {};

    if (type === "cardio") {
      updateData = {
        cardioTime: parseFloat(cardioTime) || null,
        cardioDistance: parseFloat(cardioDistance) || null,
        cardioCalories: parseFloat(cardioCalories) || null,
        cardioIncline: parseFloat(cardioIncline) || null,
        cardioSpeed: parseFloat(cardioSpeed) || null,
        sets: [],
      };
    } else {
      updateData = {
        sets: sets.map((s) => ({
          setNumber: s.setNumber,
          weight: parseFloat(s.weight) || 0,
          reps: parseFloat(s.reps) || 0,
        })),
        cardioTime: null,
        cardioDistance: null,
        cardioCalories: null,
        cardioIncline: null,
        cardioSpeed: null,
      };
    }

    const updatedLog = await prisma.workoutLog.update({
      where: { id: logId },
      data: updateData,
      include: { exercise: true },
    });

    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating exercise" });
  }
};

// Get latest workout
exports.getLatestWorkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const latest = await prisma.workout.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
      include: { exercises: { include: { exercise: true } } },
    });

    if (!latest) {
      return res.status(404).json({ message: "No previous workouts found" });
    }

    // Format for Frontend state
    const formattedExercises = latest.exercises.map((log) => ({
      uniqueId: Date.now() + Math.random(),
      exerciseId: log.exerciseId,
      name: log.exercise.name,
      bodyPart: log.exercise.bodyPart,
      type: log.exercise.type,
      sets: log.sets.map((s) => ({
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
      })),
      cardioTime: log.cardioTime,
      cardioDistance: log.cardioDistance,
      cardioCalories: log.cardioCalories,
    }));

    res.json({ exercises: formattedExercises, name: latest.name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching latest workout" });
  }
};
