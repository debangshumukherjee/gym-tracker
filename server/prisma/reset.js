const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Database Reset Script
 * Deletes ALL exercises (both System and Custom) from the database.
 * Use this before re-seeding to prevent duplicates.
 */
async function main() {
  try {
    // Delete all exercises
    const deleted = await prisma.exercise.deleteMany({});
    
    //console.log(`Deleted ${deleted.count} exercises.`);

  } catch (error) {
    //console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();