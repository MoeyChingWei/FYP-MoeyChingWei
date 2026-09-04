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
      await prisma.users.deleteMany({
        where: { id: { in: testUsers.map(u => u.id) } }
      });
    }
    testUsers = [];
  });

  afterAll(async () => {
    if (testUsers.length > 0) {
      await prisma.users.deleteMany({
        where: { id: { in: testUsers.map(user => user.id) } }
      });
    }

    // Cleanup test departments at the end
    if (testDepts.length > 0) {
      await prisma.departments.deleteMany({
        where: { id: { in: testDepts.map(d => d.id) } }
      });
    }
    await prisma.$disconnect();
    await pool.end();
  });

  test('should extract unique departments from users', async () => {
    const timestamp = Date.now();
    const engineeringDepartment = `Test Engineering ${timestamp}`;
    const marketingDepartment = `Test Marketing ${timestamp}`;
    await prisma.users.createMany({
      data: [
        { email: `user1-${timestamp}@test.com`, password: 'hash', department: engineeringDepartment },
        { email: `user2-${timestamp}@test.com`, password: 'hash', department: engineeringDepartment },
        { email: `user3-${timestamp}@test.com`, password: 'hash', department: marketingDepartment },
        { email: `user4-${timestamp}@test.com`, password: 'hash', department: null }
      ]
    });

    // Track created users for cleanup
    const createdUsers = await prisma.users.findMany({
      where: { email: { contains: `${timestamp}` } }
    });
    testUsers.push(...createdUsers);

    const result = await seedDepartmentsFromUsers(createdUsers);

    expect(result.created).toBe(2);

    // Verify the departments exist (whether newly created or pre-existing)
    const engDept = await prisma.departments.findFirst({
      where: {
        name: {
          equals: engineeringDepartment,
          mode: 'insensitive'
        }
      }
    });
    const mktDept = await prisma.departments.findFirst({
      where: {
        name: {
          equals: marketingDepartment,
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
    const engineeringDepartment = `Test Engineering ${timestamp}`;
    await prisma.users.createMany({
      data: [
        { email: `u1-${timestamp}@test.com`, password: 'hash', department: engineeringDepartment },
        { email: `u2-${timestamp}@test.com`, password: 'hash', department: engineeringDepartment.toUpperCase() },
        { email: `u3-${timestamp}@test.com`, password: 'hash', department: engineeringDepartment.toLowerCase() }
      ]
    });

    // Track created users for cleanup
    const createdUsers = await prisma.users.findMany({
      where: { email: { contains: `${timestamp}` } }
    });
    testUsers.push(...createdUsers);

    const result = await seedDepartmentsFromUsers(createdUsers);

    expect(result.created).toBe(1);

    // Verify the department exists (case should be normalized to first occurrence)
    const createdDept = await prisma.departments.findFirst({
      where: {
        name: {
          equals: engineeringDepartment,
          mode: 'insensitive'
        }
      }
    });
    expect(createdDept).toBeTruthy();

    if (createdDept) testDepts.push(createdDept);
  });
});
