import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";
import { seedDepartmentsFromUsers } from '../scripts/seed-departments.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Department Seed Script', () => {
  beforeEach(async () => {
    await prisma.department.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  test('should extract unique departments from users', async () => {
    await prisma.user.createMany({
      data: [
        { email: 'user1@test.com', password: 'hash', department: 'Engineering' },
        { email: 'user2@test.com', password: 'hash', department: 'Engineering' },
        { email: 'user3@test.com', password: 'hash', department: 'Marketing' },
        { email: 'user4@test.com', password: 'hash', department: null }
      ]
    });

    const result = await seedDepartmentsFromUsers();

    expect(result.created).toBe(2);
    expect(result.departments).toContain('Engineering');
    expect(result.departments).toContain('Marketing');

    const depts = await prisma.department.findMany();
    expect(depts.length).toBe(2);
  });

  test('should handle case-insensitive duplicates', async () => {
    await prisma.user.createMany({
      data: [
        { email: 'u1@test.com', password: 'hash', department: 'Engineering' },
        { email: 'u2@test.com', password: 'hash', department: 'ENGINEERING' },
        { email: 'u3@test.com', password: 'hash', department: 'engineering' }
      ]
    });

    const result = await seedDepartmentsFromUsers();

    expect(result.created).toBe(1);
    const depts = await prisma.department.findMany();
    expect(depts.length).toBe(1);
    expect(depts[0].name).toBe('Engineering');
  });
});
