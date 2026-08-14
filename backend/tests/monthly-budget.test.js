import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('MonthlyBudget Model', () => {
  let testDept;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'TEST', name: 'Test Department' }
    });
  });

  afterAll(async () => {
    if (testDept) {
      await prisma.monthlyBudget.deleteMany({ where: { departmentId: testDept.id } });
      await prisma.department.delete({ where: { id: testDept.id } });
    }
    await prisma.$disconnect();
    await pool.end();
  });

  test('should create monthly budget with unique constraint', async () => {
    const budget = await prisma.monthlyBudget.create({
      data: {
        departmentId: testDept.id,
        year: 2026,
        month: 8,
        allocatedAmount: 100000.00,
        spentAmount: 0,
        reservedAmount: 0
      }
    });

    expect(budget.id).toBeDefined();
    expect(parseFloat(budget.allocatedAmount)).toBe(100000.00);
    expect(parseFloat(budget.spentAmount)).toBe(0);
  });

  test('should reject duplicate department-year-month', async () => {
    await expect(
      prisma.monthlyBudget.create({
        data: {
          departmentId: testDept.id,
          year: 2026,
          month: 8,
          allocatedAmount: 50000.00
        }
      })
    ).rejects.toThrow();
  });
});
