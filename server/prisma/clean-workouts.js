/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Database Cleanup Script
 * Wipes all workout data to reset the database state.
 * Deletes child records first to maintain referential integrity.
 */
async function main() {
  try {
    // 1. Delete all Workout Logs first (Child records)
    const deletedLogs = await prisma.workoutLog.deleteMany({});
    //console.log(`Deleted ${deletedLogs.count} workout logs.`);

    // 2. Delete all Workouts (Parent records)
    const deletedWorkouts = await prisma.workout.deleteMany({});
    //console.log(`Deleted ${deletedWorkouts.count} workouts.`);
  } catch (error) {
    //console.error("Error cleaning database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
