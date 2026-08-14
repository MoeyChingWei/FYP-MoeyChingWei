import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('BudgetAdjustmentRequest Model', () => {
  let testDept, testUser;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'ADJ', name: 'Adjustment Test Dept' }
    });
    testUser = await prisma.user.create({
      data: {
        email: 'adjtest@example.com',
        password: 'hashedpassword',
        role: 'Department Executive',
        name: 'Test User'
      }
    });
  });

  afterAll(async () => {
    await prisma.budgetAdjustmentRequest.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
    await pool.end();
  });

  test('should create adjustment request with pending status', async () => {
    const request = await prisma.budgetAdjustmentRequest.create({
      data: {
        departmentId: testDept.id,
        targetYear: 2026,
        targetMonth: 9,
        requestType: 'one_time_increase',
        requestedAmount: 150000.00,
        reason: 'Urgent equipment purchase needed',
        requestedBy: testUser.id
      }
    });

    expect(request.id).toBeDefined();
    expect(request.status).toBe('pending');
    expect(parseFloat(request.requestedAmount)).toBe(150000.00);
    expect(request.reviewedBy).toBeNull();
    expect(request.requestedAt).toBeInstanceOf(Date);
  });
});
