import { describe, test, expect, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Department Model', () => {
  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  test('should create department with required fields', async () => {
    const dept = await prisma.department.create({
      data: {
        code: 'ENG',
        name: 'Engineering',
        description: 'Software development department',
        isActive: true
      }
    });

    expect(dept.id).toBeDefined();
    expect(dept.code).toBe('ENG');
    expect(dept.name).toBe('Engineering');
    expect(dept.isActive).toBe(true);
  });
});
