import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '../config/prisma.js';
import { runMonthlyPredictions } from '../services/budget-scheduler.js';
import * as predictionService from '../services/budget-prediction-service.js';

describe('Budget Scheduler', () => {
  let testDept;
  let inactiveDept;

  beforeAll(async () => {
    testDept = await prisma.department.create({
      data: { code: 'SCHD', name: 'Scheduler Test', isActive: true }
    });

    inactiveDept = await prisma.department.create({
      data: { code: 'INAC', name: 'Inactive Dept', isActive: false }
    });

    // Clean up any existing predictions for these departments
    await prisma.budgetPrediction.deleteMany({
      where: { departmentId: { in: [testDept.id, inactiveDept.id] } }
    });
  });

  afterAll(async () => {
    await prisma.budgetPrediction.deleteMany({
      where: { departmentId: { in: [testDept.id, inactiveDept.id] } }
    });
    await prisma.department.deleteMany({
      where: { id: { in: [testDept.id, inactiveDept.id] } }
    });
    await prisma.$disconnect();
  });

  test('should run predictions for all active departments', async () => {
    const result = await runMonthlyPredictions();

    expect(result.success).toBeGreaterThanOrEqual(1);
    // Don't assert on failed count - other test departments may cause failures

    const predictions = await prisma.budgetPrediction.findMany({
      where: { departmentId: testDept.id }
    });

    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions[0].triggerType).toBe('auto');
  });

  test('should skip inactive departments', async () => {
    await runMonthlyPredictions();

    const predictions = await prisma.budgetPrediction.findMany({
      where: { departmentId: inactiveDept.id }
    });

    expect(predictions.length).toBe(0);
  });

  test('should handle prediction failures gracefully', async () => {
    const spy = vi.spyOn(predictionService, 'generateDepartmentPrediction');
    spy.mockImplementation((code) => {
      if (code === 'SCHD') {
        throw new Error('Mock prediction failure');
      }
      return predictionService.generateDepartmentPrediction(code);
    });

    const result = await runMonthlyPredictions();

    expect(result.failed).toBeGreaterThanOrEqual(1);

    spy.mockRestore();
  });

  test('should calculate correct target month and year', async () => {
    const now = new Date();
    const expectedYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const expectedMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;

    await runMonthlyPredictions();

    const prediction = await prisma.budgetPrediction.findFirst({
      where: { departmentId: testDept.id },
      orderBy: { createdAt: 'desc' }
    });

    expect(prediction.targetYear).toBe(expectedYear);
    expect(prediction.targetMonth).toBe(expectedMonth);
  });

  test('should create notifications for department heads', async () => {
    // Create a test user who is a department head
    const testUser = await prisma.user.create({
      data: {
        email: 'dept.head@test.com',
        password: 'hashedpassword',
        name: 'Test Dept Head',
        role: 'Department Executive',
        department: 'SCHD'
      }
    });

    // Clean up old notifications
    await prisma.notification.deleteMany({
      where: { userId: testUser.id }
    });

    await runMonthlyPredictions();

    const notifications = await prisma.notification.findMany({
      where: {
        userId: testUser.id,
        type: 'BUDGET_PREDICTION_READY'
      }
    });

    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].title).toBe('New Budget Prediction Available');
    expect(notifications[0].refType).toBe('budget_prediction');

    // Cleanup
    await prisma.notification.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });
});

