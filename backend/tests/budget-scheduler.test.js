import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../config/prisma.js';
import { runMonthlyPredictions } from '../services/budget-scheduler.js';

describe('Budget Scheduler', () => {
  let testDept;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'SCHD', name: 'Scheduler Test', isActive: true }
    });

    // Clean up any existing predictions for this department
    await prisma.budgetPrediction.deleteMany({
      where: { departmentId: testDept.id }
    });
  });

  afterAll(async () => {
    await prisma.budgetPrediction.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
  });

  test('should run predictions for all active departments', async () => {
    const result = await runMonthlyPredictions();

    expect(result.success).toBeGreaterThanOrEqual(1);
    expect(result.failed).toBe(0);

    const predictions = await prisma.budgetPrediction.findMany({
      where: { departmentId: testDept.id }
    });

    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions[0].triggerType).toBe('auto');
  });
});
