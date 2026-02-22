/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const STANDARD_EXERCISES = [
  // --- CHEST ---
  { name: "Bench Press", type: "strength", bodyPart: "Chest" },
  { name: "Flat Dumbbell Press", type: "strength", bodyPart: "Chest" },
  { name: "Incline Dumbbell Press", type: "strength", bodyPart: "Chest" },
  { name: "Incline Barbell Press", type: "strength", bodyPart: "Chest" },
  { name: "Pec Deck", type: "strength", bodyPart: "Chest" },
  { name: "Cable Flys", type: "strength", bodyPart: "Chest" },
  { name: "Push Ups", type: "strength", bodyPart: "Chest" },

  // --- SHOULDERS ---
  { name: "Machine Shoulder Press", type: "strength", bodyPart: "Shoulders" },
  { name: "Barbell Overhead Press", type: "strength", bodyPart: "Shoulders" },
  { name: "Dumbbell Lateral Raises", type: "strength", bodyPart: "Shoulders" },
  { name: "Face Pull", type: "strength", bodyPart: "Shoulders" },
  { name: "Reverse Pec Deck", type: "strength", bodyPart: "Shoulders" },
  { name: "Dumbbell Shrugs", type: "strength", bodyPart: "Shoulders" },
  { name: "Arnold Press", type: "strength", bodyPart: "Shoulders" },

  // --- TRICEPS ---
  { name: "Rope Pushdown", type: "strength", bodyPart: "Triceps" },
  { name: "Straight Bar Pushdown", type: "strength", bodyPart: "Triceps" },
  { name: "Overhead Rope Extension", type: "strength", bodyPart: "Triceps" },
  {
    name: "Overhead Dumbbell Extension",
    type: "strength",
    bodyPart: "Triceps",
  },
  { name: "Skull Crushers", type: "strength", bodyPart: "Triceps" },
  { name: "Dips", type: "strength", bodyPart: "Triceps" },

  // --- BACK ---
  { name: "Deadlift", type: "strength", bodyPart: "Back" },
  { name: "Barbell Rows", type: "strength", bodyPart: "Back" },
  { name: "T-Bar Rows", type: "strength", bodyPart: "Back" },
  { name: "Wide Grip Lat Pulldown", type: "strength", bodyPart: "Back" },
  { name: "Seated Cable Row", type: "strength", bodyPart: "Back" },
  { name: "Hyperextensions", type: "strength", bodyPart: "Back" },
  { name: "Pull Ups", type: "strength", bodyPart: "Back" },

  // --- BICEPS ---
  { name: "Barbell Curls", type: "strength", bodyPart: "Biceps" },
  { name: "EZ Bar Curls", type: "strength", bodyPart: "Biceps" },
  { name: "Straight Bar Cable Curls", type: "strength", bodyPart: "Biceps" },
  { name: "Hammer Curls", type: "strength", bodyPart: "Biceps" },
  { name: "Preacher Curls", type: "strength", bodyPart: "Biceps" },

  // --- LEGS ---
  { name: "Squats", type: "strength", bodyPart: "Legs" },
  { name: "Leg Press", type: "strength", bodyPart: "Legs" },
  { name: "Weighted Lunges", type: "strength", bodyPart: "Legs" },
  { name: "Leg Extension", type: "strength", bodyPart: "Legs" },
  { name: "Lying Leg Curls", type: "strength", bodyPart: "Legs" },
  { name: "Romanian Deadlift", type: "strength", bodyPart: "Legs" },
  { name: "Standing Calf Raises", type: "strength", bodyPart: "Calves" },
  { name: "Seated Calf Raises", type: "strength", bodyPart: "Calves" },

  // --- ABS ---
  { name: "Crunches", type: "strength", bodyPart: "Abs" },
  { name: "Plank", type: "strength", bodyPart: "Abs" },
  { name: "Leg Raises", type: "strength", bodyPart: "Abs" },
  { name: "Russian Twists", type: "strength", bodyPart: "Abs" },

  // --- CARDIO ---
  { name: "Treadmill Run", type: "cardio", bodyPart: "Cardio" },
  { name: "Cycling", type: "cardio", bodyPart: "Cardio" },
  { name: "Elliptical", type: "cardio", bodyPart: "Cardio" },
  { name: "Rowing Machine", type: "cardio", bodyPart: "Cardio" },
];

async function main() {
  // Clean up existing system exercises (where userId is null)
  await prisma.exercise.deleteMany({ where: { userId: null } });

  // Insert standard exercises
  await prisma.exercise.createMany({ data: STANDARD_EXERCISES });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
