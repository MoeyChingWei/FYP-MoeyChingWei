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

describe('BudgetPrediction Model', () => {
  let testDept;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'PRED', name: 'Prediction Test Dept' }
    });
  });

  afterAll(async () => {
    await prisma.budgetPrediction.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
  });

  test('should create prediction with all fields', async () => {
    const prediction = await prisma.budgetPrediction.create({
      data: {
        departmentId: testDept.id,
        targetYear: 2026,
        targetMonth: 9,
        predictedAmount: 125000.50,
        confidence: 'high',
        algorithm: 'holt_winters',
        aiInsights: 'September shows 15% seasonal increase',
        categoryBreakdown: {
          "Raw Materials": 50000,
          "Services": 75000
        },
        triggerType: 'manual'
      }
    });

    expect(prediction.id).toBeDefined();
    expect(prediction.confidence).toBe('high');
    expect(prediction.categoryBreakdown).toHaveProperty('Raw Materials');
    expect(prediction.createdAt).toBeInstanceOf(Date);
  });

  test('should allow null departmentId for new departments', async () => {
    const pred = await prisma.budgetPrediction.create({
      data: {
        departmentId: null,
        targetYear: 2026,
        targetMonth: 10,
        predictedAmount: 80000,
        confidence: 'low',
        algorithm: 'similar_dept',
        aiInsights: 'Based on similar department data',
        triggerType: 'manual'
      }
    });

    expect(pred.departmentId).toBeNull();
    expect(pred.algorithm).toBe('similar_dept');
    expect(pred.createdAt).toBeInstanceOf(Date);
  });
});
