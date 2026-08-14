import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import prisma from '../config/prisma.js';
import departmentRouter from '../routes/department-budget.js';
import * as predictionService from '../services/budget-prediction-service.js';
import * as notificationService from '../services/notification-service.js';

const app = express();
app.use(express.json());
app.use('/api/department-budget', departmentRouter);

describe('Department Budget Routes', () => {
  let testDept;

  beforeAll(async () => {
    // Clean up any existing test department first
    await prisma.department.deleteMany({ where: { code: 'TEST-DEPT' } });

    testDept = await prisma.department.create({
      data: { code: 'TEST-DEPT', name: 'Test Department' }
    });
  });

  afterAll(async () => {
    await prisma.monthlyBudget.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
  });

  describe('GET /api/department-budget/departments', () => {
    test('should return all departments ordered by name', async () => {
      const res = await request(app)
        .get('/api/department-budget/departments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const testDeptInResponse = res.body.data.find(d => d.id === testDept.id);
      expect(testDeptInResponse).toBeDefined();
      expect(testDeptInResponse.code).toBe('TEST-DEPT');
      expect(testDeptInResponse.name).toBe('Test Department');

      for (let i = 1; i < res.body.data.length; i++) {
        const prev = res.body.data[i - 1].name.toLowerCase();
        const curr = res.body.data[i].name.toLowerCase();
        expect(prev <= curr).toBe(true);
      }

      res.body.data.forEach(dept => {
        expect(dept).toHaveProperty('id');
        expect(dept).toHaveProperty('code');
        expect(dept).toHaveProperty('name');
        expect(typeof dept.id).toBe('number');
        expect(typeof dept.code).toBe('string');
        expect(typeof dept.name).toBe('string');
      });
    });
  });

  describe('Monthly Budget Endpoints', () => {
    let testBudget;

    beforeAll(async () => {
      testBudget = await prisma.monthlyBudget.create({
        data: {
          departmentId: testDept.id,
          year: 2026,
          month: 8,
          allocatedAmount: 100000,
          spentAmount: 0,
          reservedAmount: 0
        }
      });
    });

    afterAll(async () => {
      await prisma.monthlyBudget.deleteMany({ where: { departmentId: testDept.id } });
    });

    describe('GET /api/department-budget/monthly/:departmentId', () => {
      test('should return monthly budgets for department', async () => {
        const res = await request(app).get(`/api/department-budget/monthly/${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });

      test('should filter by year and month', async () => {
        const res = await request(app).get(`/api/department-budget/monthly/${testDept.id}?year=2026&month=8`);

        expect(res.status).toBe(200);
        expect(res.body.data[0].year).toBe(2026);
        expect(res.body.data[0].month).toBe(8);
      });
    });

    describe('POST /api/department-budget/monthly', () => {
      test('should create new monthly budget', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026,
            month: 9,
            allocatedAmount: 120000,
            notes: 'Test budget'
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.allocatedAmount).toBe('120000');
      });

      test('should reject duplicate month budget', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026,
            month: 8,
            allocatedAmount: 50000
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject missing required fields', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Missing required fields');
      });

      test('should reject invalid month', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026,
            month: 13,
            allocatedAmount: 100000
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Month must be between 1 and 12');
      });

      test('should reject negative allocatedAmount', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026,
            month: 10,
            allocatedAmount: -1000
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('must be a positive number');
      });

      test('should reject zero allocatedAmount', async () => {
        const res = await request(app)
          .post('/api/department-budget/monthly')
          .send({
            departmentId: testDept.id,
            year: 2026,
            month: 11,
            allocatedAmount: 0
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('must be a positive number');
      });
    });

    describe('PATCH /api/department-budget/monthly/:id', () => {
      test('should update monthly budget', async () => {
        const res = await request(app)
          .patch(`/api/department-budget/monthly/${testBudget.id}`)
          .send({
            allocatedAmount: 110000,
            notes: 'Updated budget'
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.allocatedAmount).toBe('110000');
        expect(res.body.data.notes).toBe('Updated budget');
      });

      test('should return 404 for non-existent budget', async () => {
        const res = await request(app)
          .patch('/api/department-budget/monthly/999999')
          .send({
            allocatedAmount: 50000
          });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Monthly budget not found');
      });

      test('should reject negative allocatedAmount', async () => {
        const res = await request(app)
          .patch(`/api/department-budget/monthly/${testBudget.id}`)
          .send({
            allocatedAmount: -5000
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('must be a positive number');
      });

      test('should reject update with no fields', async () => {
        const res = await request(app)
          .patch(`/api/department-budget/monthly/${testBudget.id}`)
          .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('No fields to update');
      });
    });
  });

  describe('Budget Prediction Trigger Endpoints', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('POST /api/department-budget/predict/manual', () => {
      test('should trigger manual prediction for department', async () => {
        const mockPrediction = {
          id: 1,
          departmentId: testDept.id,
          targetYear: 2026,
          targetMonth: 9,
          predictedAmount: 85000,
          confidence: 'medium',
          triggerType: 'manual'
        };

        vi.spyOn(predictionService, 'generateDepartmentPrediction').mockResolvedValue(mockPrediction);

        const res = await request(app)
          .post('/api/department-budget/predict/manual')
          .send({
            departmentCode: testDept.code,
            targetYear: 2026,
            targetMonth: 9,
            userId: 1
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.predictedAmount).toBe(85000);
        expect(predictionService.generateDepartmentPrediction).toHaveBeenCalledWith(
          testDept.code,
          2026,
          9,
          1
        );
      });

      test('should return 400 for missing parameters', async () => {
        const res = await request(app)
          .post('/api/department-budget/predict/manual')
          .send({
            departmentCode: testDept.code
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('POST /api/department-budget/predict/batch', () => {
      test('should trigger predictions for all active departments', async () => {
        const mockResults = {
          success: [{ departmentId: testDept.id, predictionId: 1 }],
          failed: []
        };

        vi.spyOn(predictionService, 'generatePredictionsForAllDepartments').mockResolvedValue(mockResults);

        const res = await request(app)
          .post('/api/department-budget/predict/batch')
          .send({
            targetYear: 2026,
            targetMonth: 9,
            userId: 1
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.successCount).toBe(1);
        expect(res.body.data.failedCount).toBe(0);
      });
    });
  });

  describe('Budget Adjustment Request Endpoints', () => {
    let testUser, financeUser, testBudget, testAdjustment;

    beforeAll(async () => {
      testUser = await prisma.user.create({
        data: { email: 'depthead@test.com', password: 'hash', name: 'Dept Head', role: 'Department Executive' }
      });

      financeUser = await prisma.user.create({
        data: { email: 'finance@test.com', password: 'hash', name: 'Finance Mgr', role: 'Treasury/Finance Officer' }
      });

      testBudget = await prisma.monthlyBudget.create({
        data: {
          departmentId: testDept.id,
          year: 2026,
          month: 10,
          allocatedAmount: 100000,
          spentAmount: 0,
          reservedAmount: 0
        }
      });
    });

    afterAll(async () => {
      await prisma.budgetAdjustmentRequest.deleteMany({ where: { departmentId: testDept.id } });
      await prisma.monthlyBudget.delete({ where: { id: testBudget.id } });
      await prisma.user.deleteMany({ where: { id: { in: [testUser.id, financeUser.id] } } });
    });

    describe('POST /api/department-budget/adjustments', () => {
      test('should create budget adjustment request', async () => {
        vi.spyOn(notificationService, 'notifyBudgetAdjustmentRequested').mockResolvedValue({});

        const res = await request(app)
          .post('/api/department-budget/adjustments')
          .send({
            departmentId: testDept.id,
            targetYear: 2026,
            targetMonth: 10,
            requestType: 'increase',
            requestedAmount: 25000,
            reason: 'Emergency equipment purchase',
            requestedBy: testUser.id
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.requestedAmount).toBe('25000');
        expect(res.body.data.status).toBe('pending');
        expect(notificationService.notifyBudgetAdjustmentRequested).toHaveBeenCalled();

        testAdjustment = res.body.data;
      });

      test('should return 400 for missing parameters', async () => {
        const res = await request(app)
          .post('/api/department-budget/adjustments')
          .send({
            departmentId: testDept.id
          });

        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/department-budget/adjustments', () => {
      test('should get all adjustment requests', async () => {
        const res = await request(app).get('/api/department-budget/adjustments');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      test('should filter by status', async () => {
        const res = await request(app).get('/api/department-budget/adjustments?status=pending');

        expect(res.status).toBe(200);
        expect(res.body.data.every(r => r.status === 'pending')).toBe(true);
      });

      test('should filter by department', async () => {
        const res = await request(app).get(`/api/department-budget/adjustments?departmentId=${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.every(r => r.departmentId === testDept.id)).toBe(true);
      });
    });

    describe('PATCH /api/department-budget/adjustments/:id/approve', () => {
      test('should approve adjustment request and update budget', async () => {
        vi.spyOn(notificationService, 'notifyBudgetAdjustmentApproved').mockResolvedValue({});

        const res = await request(app)
          .patch(`/api/department-budget/adjustments/${testAdjustment.id}/approve`)
          .send({
            reviewedBy: financeUser.id,
            reviewComment: 'Approved for Q3 equipment'
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.request.status).toBe('approved');
        expect(res.body.data.updatedBudget.allocatedAmount).toBe('125000');
        expect(notificationService.notifyBudgetAdjustmentApproved).toHaveBeenCalled();
      });
    });

    describe('PATCH /api/department-budget/adjustments/:id/reject', () => {
      test('should reject adjustment request', async () => {
        vi.spyOn(notificationService, 'notifyBudgetAdjustmentRejected').mockResolvedValue({});

        const newRequest = await prisma.budgetAdjustmentRequest.create({
          data: {
            departmentId: testDept.id,
            targetYear: 2026,
            targetMonth: 10,
            requestType: 'additional',
            requestedAmount: 10000,
            reason: 'Test reject',
            requestedBy: testUser.id,
            status: 'pending'
          }
        });

        const res = await request(app)
          .patch(`/api/department-budget/adjustments/${newRequest.id}/reject`)
          .send({
            reviewedBy: financeUser.id,
            reviewComment: 'Insufficient justification'
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('rejected');
        expect(notificationService.notifyBudgetAdjustmentRejected).toHaveBeenCalled();
      });
    });
  });
});
