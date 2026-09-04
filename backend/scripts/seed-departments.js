import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedDepartmentsFromUsers(usersToSeed) {
  const users = usersToSeed ?? await prisma.users.findMany({
    where: {
      department: { not: null }
    },
    select: { department: true }
  });

  const uniqueDepts = new Map();

  users.forEach(user => {
    const deptName = String(user.department ?? '').trim();
    if (!deptName) return;
    const lowerName = deptName.toLowerCase();

    if (!uniqueDepts.has(lowerName)) {
      uniqueDepts.set(lowerName, deptName);
    }
  });

  const created = [];

  for (const [lowerName, displayName] of uniqueDepts.entries()) {
    // Check if department with this name already exists (case-insensitive)
    const existingByName = await prisma.departments.findFirst({
      where: {
        name: {
          equals: displayName,
          mode: 'insensitive'
        }
      }
    });

    if (existingByName) {
      console.log(`Department "${displayName}" already exists, skipping`);
      continue;
    }

    let code;
    let attempts = 0;
    const maxAttempts = 20;

    // Generate unique code with retry logic
    do {
      if (attempts === 0) {
        // First attempt: use first 3 characters
        code = displayName.substring(0, 3).toUpperCase();
      } else if (attempts < 10) {
        // Attempts 1-9: add numeric suffix
        code = displayName.substring(0, 2).toUpperCase() + attempts;
      } else {
        // Attempts 10+: use random suffix for highly contested codes
        const randomSuffix = Math.floor(Math.random() * 1000);
        code = displayName.substring(0, 2).toUpperCase() + randomSuffix;
      }

      const existing = await prisma.departments.findUnique({
        where: { code }
      });

      if (!existing) break;

      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      console.error(`Failed to generate unique code for department: ${displayName}`);
      throw new Error(`Could not generate unique code for department "${displayName}" after ${maxAttempts} attempts`);
    }

    const dept = await prisma.departments.create({
      data: {
        code,
        name: displayName,
        description: `Auto-generated from User.department field`,
        isActive: true,
        updatedAt: new Date(),
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
