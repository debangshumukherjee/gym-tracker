/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Database Reset Script - Deletes ALL exercises from the database
async function main() {
  try {
    // Delete all exercises
    await prisma.exercise.deleteMany({});
  } catch (error) {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
