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
  let createdDeptId;

  afterAll(async () => {
    if (createdDeptId) {
      await prisma.departments.delete({ where: { id: createdDeptId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await pool.end();
  });

  test('should create department with required fields', async () => {
    const timestamp = Date.now();
    const dept = await prisma.departments.create({
      data: {
        code: `ENG${timestamp}`.substring(0, 10),
        name: 'Engineering',
        description: 'Software development department',
        isActive: true,
        updatedAt: new Date(),
      }
    });

    createdDeptId = dept.id;
    expect(dept.id).toBeDefined();
    expect(dept.code).toContain('ENG');
    expect(dept.name).toBe('Engineering');
    expect(dept.isActive).toBe(true);
  });
});
