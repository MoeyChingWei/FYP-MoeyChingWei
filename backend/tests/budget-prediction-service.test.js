import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";
import { generateDepartmentPrediction } from '../services/budget-prediction-service.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Budget Prediction Service', () => {
  let testDept;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'PSVC', name: 'Prediction Service Test' }
    });
  });

  afterAll(async () => {
    await prisma.budgetPrediction.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
    await pool.end();
  });

  test('should generate prediction for department with history', async () => {
    const prediction = await generateDepartmentPrediction('PSVC', 2026, 9, null);

    expect(prediction).toBeDefined();
    expect(prediction.departmentId).toBe(testDept.id);
    expect(prediction.targetYear).toBe(2026);
    expect(prediction.targetMonth).toBe(9);
    expect(prediction.predictedAmount).toBeDefined();
    expect(parseFloat(prediction.predictedAmount)).toBeGreaterThan(0);
    expect(prediction.confidence).toMatch(/^(low|medium|high)$/);
    expect(prediction.algorithm).toBeDefined();
  });
});
