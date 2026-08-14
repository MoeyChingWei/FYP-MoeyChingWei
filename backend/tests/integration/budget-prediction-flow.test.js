import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma.js';
import departmentRouter from '../../routes/department-budget.js';
import * as predictionService from '../../services/budget-prediction-service.js';

const app = express();
app.use(express.json());
app.use('/api/department-budget', departmentRouter);

describe('Budget Prediction Flow Integration', () => {
  let testDepartment;
  let testUser;

  beforeAll(async () => {
    // Create test department
    testDepartment = await prisma.department.create({
      data: {
        code: 'TEST_DEPT',
        name: 'Test Department',
        isActive: true
      }
    });

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedpass',
        name: 'Test User',
        role: 'Department Executive'
      }
    });

    // Create historical budgets for the department (past 6 months)
    const now = new Date();
    for (let i = 6; i >= 1; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      await prisma.monthlyBudget.create({
        data: {
          departmentId: testDepartment.id,
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1,
          allocatedAmount: 50000 + (i * 1000), // Increasing trend
          spentAmount: 45000 + (i * 900),
          reservedAmount: 40000 + (i * 800)
        }
      });
    }
  });

  afterAll(async () => {
    // Cleanup
    await prisma.budgetPrediction.deleteMany({
      where: { departmentId: testDepartment.id }
    });
    await prisma.monthlyBudget.deleteMany({
      where: { departmentId: testDepartment.id }
    });
    await prisma.notification.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.department.delete({
      where: { id: testDepartment.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
  });

  describe('Manual Prediction Trigger', () => {
    test('should generate prediction, save to DB, and send notification', async () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const response = await request(app)
        .post('/api/department-budget/predict/manual')
        .send({
          departmentCode: testDepartment.code,
          targetYear: nextMonth.getFullYear(),
          targetMonth: nextMonth.getMonth() + 1,
          userId: testUser.id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('predictedAmount');
      expect(response.body.data).toHaveProperty('confidence');
      expect(response.body.data.triggerType).toBe('manual');

      // Verify prediction saved in database
      const savedPrediction = await prisma.budgetPrediction.findFirst({
        where: {
          departmentId: testDepartment.id,
          targetYear: nextMonth.getFullYear(),
          targetMonth: nextMonth.getMonth() + 1,
          triggerType: 'manual'
        }
      });

      expect(savedPrediction).toBeTruthy();
      expect(Number(savedPrediction.predictedAmount)).toBeGreaterThan(0);
      expect(['high', 'medium', 'low']).toContain(savedPrediction.confidence);

      // Verify notification created
      const notification = await prisma.notification.findFirst({
        where: {
          userId: testUser.id,
          type: 'BUDGET_PREDICTION_READY',
          refType: 'budget_prediction',
          refId: String(savedPrediction.id)
        }
      });

      expect(notification).toBeTruthy();
      expect(notification.title).toContain('Prediction');
      expect(notification.isRead).toBe(false);
    });

    test('should handle prediction failure and send failure notification', async () => {
      // Create department with insufficient historical data
      const newDept = await prisma.department.create({
        data: {
          code: `NEW_DEPT_${Date.now()}`,
          name: 'New Department',
          isActive: true
        }
      });

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const response = await request(app)
        .post('/api/department-budget/predict/manual')
        .send({
          departmentCode: newDept.code,
          targetYear: nextMonth.getFullYear(),
          targetMonth: nextMonth.getMonth() + 1,
          userId: testUser.id
        });

      // Should still return 200 but with fallback prediction
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Check if fallback notification was sent
      const notification = await prisma.notification.findFirst({
        where: {
          userId: testUser.id,
          type: 'BUDGET_PREDICTION_READY',
          refType: 'budget_prediction'
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(notification).toBeTruthy();

      // Cleanup
      await prisma.budgetPrediction.deleteMany({ where: { departmentId: newDept.id } });
      await prisma.department.delete({ where: { id: newDept.id } });
    });
  });

  describe('Automatic Prediction Trigger', () => {
    test('should generate predictions for all active departments', async () => {
      // Create another test department
      const dept2 = await prisma.department.create({
        data: {
          code: 'TEST_DEPT_2',
          name: 'Test Department 2',
          isActive: true
        }
      });

      // Add historical data for dept2
      const now = new Date();
      for (let i = 3; i >= 1; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        await prisma.monthlyBudget.create({
          data: {
            departmentId: dept2.id,
            year: targetDate.getFullYear(),
            month: targetDate.getMonth() + 1,
            allocatedAmount: 30000,
            spentAmount: 27000,
            reservedAmount: 25000
          }
        });
      }

      // Trigger automatic prediction (simulating cron job)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const results = await predictionService.generatePredictionsForAllDepartments(
        nextMonth.getFullYear(),
        nextMonth.getMonth() + 1,
        null
      );

      expect(results.success.length).toBeGreaterThanOrEqual(2);

      const dept1Result = results.success.find(r => r.departmentId === testDepartment.id);
      const dept2Result = results.success.find(r => r.departmentId === dept2.id);

      expect(dept1Result).toBeTruthy();
      expect(dept1Result.predictionId).toBeDefined();

      expect(dept2Result).toBeTruthy();
      expect(dept2Result.predictionId).toBeDefined();

      // Verify predictions saved
      const predictions = await prisma.budgetPrediction.findMany({
        where: {
          departmentId: { in: [testDepartment.id, dept2.id] },
          triggerType: 'auto'
        }
      });

      expect(predictions.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await prisma.budgetPrediction.deleteMany({
        where: { departmentId: dept2.id }
      });
      await prisma.monthlyBudget.deleteMany({
        where: { departmentId: dept2.id }
      });
      await prisma.department.delete({ where: { id: dept2.id } });
    });
  });

  describe('Prediction with Similar Department Fallback', () => {
    test('should use similar department data when new department has no history', async () => {
      // Create new department with no history
      const newDept = await prisma.department.create({
        data: {
          code: `BRAND_NEW_${Date.now()}`,
          name: 'Brand New Department',
          isActive: true
        }
      });

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const response = await request(app)
        .post('/api/department-budget/predict/manual')
        .send({
          departmentCode: newDept.code,
          targetYear: nextMonth.getFullYear(),
          targetMonth: nextMonth.getMonth() + 1,
          userId: testUser.id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Number(response.body.data.predictedAmount)).toBeGreaterThan(0);

      // Check if similar department was used
      const savedPrediction = await prisma.budgetPrediction.findFirst({
        where: {
          departmentId: newDept.id
        }
      });

      expect(savedPrediction).toBeTruthy();
      // Low confidence expected for new department
      expect(savedPrediction.confidence).toBe('low');

      // Cleanup
      await prisma.budgetPrediction.deleteMany({
        where: { departmentId: newDept.id }
      });
      await prisma.department.delete({ where: { id: newDept.id } });
    });
  });
});
