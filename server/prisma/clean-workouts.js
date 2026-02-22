/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Database Cleanup Script - Wipes all workout data
async function main() {
  try {
    // Delete all Workout Logs first (Child records)
    await prisma.workoutLog.deleteMany({});

    // Delete all Workouts (Parent records)
    await prisma.workout.deleteMany({});
  } catch (error) {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
