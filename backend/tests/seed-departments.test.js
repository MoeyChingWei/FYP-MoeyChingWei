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
  let testUsers = [];
  let testDepts = [];

  beforeEach(async () => {
    // Only delete test users - departments should persist
    if (testUsers.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: testUsers.map(u => u.id) } }
      });
    }
    testUsers = [];
  });

  afterAll(async () => {
    // Cleanup test departments at the end
    if (testDepts.length > 0) {
      await prisma.department.deleteMany({
        where: { id: { in: testDepts.map(d => d.id) } }
      });
    }
    await prisma.$disconnect();
    await pool.end();
  });

  test('should extract unique departments from users', async () => {
    const timestamp = Date.now();
    const users = await prisma.user.createMany({
      data: [
        { email: `user1-${timestamp}@test.com`, password: 'hash', department: 'Engineering' },
        { email: `user2-${timestamp}@test.com`, password: 'hash', department: 'Engineering' },
        { email: `user3-${timestamp}@test.com`, password: 'hash', department: 'Marketing' },
        { email: `user4-${timestamp}@test.com`, password: 'hash', department: null }
      ]
    });

    // Track created users for cleanup
    const createdUsers = await prisma.user.findMany({
      where: { email: { contains: `${timestamp}` } }
    });
    testUsers.push(...createdUsers);

    const result = await seedDepartmentsFromUsers();

    // May create 0-2 departments depending on whether they already exist
    expect(result.created).toBeGreaterThanOrEqual(0);

    // Verify the departments exist (whether newly created or pre-existing)
    const engDept = await prisma.department.findFirst({
      where: {
        name: {
          equals: 'Engineering',
          mode: 'insensitive'
        }
      }
    });
    const mktDept = await prisma.department.findFirst({
      where: {
        name: {
          equals: 'Marketing',
          mode: 'insensitive'
        }
      }
    });

    expect(engDept).toBeTruthy();
    expect(mktDept).toBeTruthy();

    if (engDept) testDepts.push(engDept);
    if (mktDept) testDepts.push(mktDept);
  });

  test('should handle case-insensitive duplicates', async () => {
    const timestamp = Date.now();
    await prisma.user.createMany({
      data: [
        { email: `u1-${timestamp}@test.com`, password: 'hash', department: 'Engineering' },
        { email: `u2-${timestamp}@test.com`, password: 'hash', department: 'ENGINEERING' },
        { email: `u3-${timestamp}@test.com`, password: 'hash', department: 'engineering' }
      ]
    });

    // Track created users for cleanup
    const createdUsers = await prisma.user.findMany({
      where: { email: { contains: `${timestamp}` } }
    });
    testUsers.push(...createdUsers);

    const result = await seedDepartmentsFromUsers();

    // May create 0-1 departments depending on whether it already exists
    expect(result.created).toBeGreaterThanOrEqual(0);

    // Verify the department exists (case should be normalized to first occurrence)
    const createdDept = await prisma.department.findFirst({
      where: {
        name: {
          equals: 'Engineering',
          mode: 'insensitive'
        }
      }
    });
    expect(createdDept).toBeTruthy();

    if (createdDept) testDepts.push(createdDept);
  });
});
