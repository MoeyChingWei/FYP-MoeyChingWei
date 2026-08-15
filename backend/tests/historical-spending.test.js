import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";
import { getHistoricalSpending } from '../services/budget-prediction-service.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Historical Spending Aggregation', () => {
  let testDept, testUser, prRecord;

  beforeAll(async () => {
    const timestamp = Date.now();
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);

    // Clean up any existing test data first
    await prisma.purchaseRequestRecord.deleteMany({
      where: { localId: { startsWith: 'PR-HIST-' } }
    });
    await prisma.user.deleteMany({
      where: { email: { contains: 'hist-' } }
    });
    await prisma.department.deleteMany({
      where: { code: { startsWith: 'H' } }
    });

    testDept = await prisma.department.create({
      data: { code: `H${timestamp}${uniqueSuffix}`.substring(0, 10), name: `Historical Test ${timestamp}`, isActive: true }
    });
    testUser = await prisma.user.create({
      data: {
        email: `hist-${timestamp}-${uniqueSuffix}@test.com`,
        password: 'hash',
        name: 'Historical Test User',
        role: 'Department Executive',
        department: testDept.code,
        isActive: true
      }
    });

    prRecord = await prisma.purchaseRequestRecord.create({
      data: {
        localId: `PR-HIST-${timestamp}-${uniqueSuffix}`,
        payload: {
          status: 'APPROVED',
          requestorId: testUser.id,
          createdAt: '2026-07-15',
          lineItems: [
            { itemName: 'Item A', quantity: 5, unitPrice: 100, itemCategory: 'Materials' },
            { itemName: 'Item B', quantity: 2, unitPrice: 250, itemCategory: 'Services' }
          ]
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.purchaseRequestRecord.delete({ where: { localId: prRecord.localId } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
    await pool.end();
  });

  test('should aggregate approved PRs by month', async () => {
    const history = await getHistoricalSpending(testDept.id);

    expect(history.length).toBeGreaterThan(0);
    expect(history[0]).toHaveProperty('period');
    expect(history[0]).toHaveProperty('amount');
    expect(history[0]).toHaveProperty('requestCount');
    expect(history[0].amount).toBe(1000);
  });

  test('should group by item category', async () => {
    const history = await getHistoricalSpending(testDept.id);

    expect(history[0].categoryTotals).toHaveProperty('Materials');
    expect(history[0].categoryTotals.Materials).toBe(500);
    expect(history[0].categoryTotals.Services).toBe(500);
  });
});
