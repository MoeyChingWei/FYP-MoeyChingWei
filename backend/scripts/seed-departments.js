import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedDepartmentsFromUsers() {
  const users = await prisma.user.findMany({
    where: {
      department: { not: null }
    },
    select: { department: true }
  });

  const uniqueDepts = new Map();

  users.forEach(user => {
    const deptName = user.department.trim();
    const lowerName = deptName.toLowerCase();

    if (!uniqueDepts.has(lowerName)) {
      uniqueDepts.set(lowerName, deptName);
    }
  });

  const created = [];

  for (const [lowerName, displayName] of uniqueDepts.entries()) {
    let code;
    let attempts = 0;
    const maxAttempts = 10;

    // Generate unique code with retry logic
    do {
      if (attempts === 0) {
        // First attempt: use first 3 characters
        code = displayName.substring(0, 3).toUpperCase();
      } else {
        // Subsequent attempts: add numeric suffix
        code = displayName.substring(0, 2).toUpperCase() + attempts;
      }

      const existing = await prisma.department.findUnique({
        where: { code }
      });

      if (!existing) break;

      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      console.error(`Failed to generate unique code for department: ${displayName}`);
      throw new Error(`Could not generate unique code for department "${displayName}" after ${maxAttempts} attempts`);
    }

    const dept = await prisma.department.create({
      data: {
        code,
        name: displayName,
        description: `Auto-generated from User.department field`,
        isActive: true
      }
    });
    created.push(dept.name);
  }

  return {
    created: created.length,
    departments: created
  };
}

async function main() {
  console.log('Starting department seed...');
  const result = await seedDepartmentsFromUsers();
  console.log(`Created ${result.created} departments:`, result.departments);
  await prisma.$disconnect();
  await pool.end();
}

// Check if this module is being run directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(console.error);
}
