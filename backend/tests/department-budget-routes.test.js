import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import prisma from '../config/prisma.js';
import departmentRouter from '../routes/department-budget.js';
import * as predictionService from '../services/budget-prediction-service.js';
import * as notificationService from '../services/notification-service.js';

vi.mock('../services/notification-service.js');

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
        notificationService.notifyBudgetAdjustmentRequested.mockResolvedValue({});

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
        notificationService.notifyBudgetAdjustmentApproved.mockResolvedValue({});

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
        notificationService.notifyBudgetAdjustmentRejected.mockResolvedValue({});

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

  describe('Budget Usage Endpoints', () => {
    let testUser, testBudget;

    beforeAll(async () => {
      testUser = await prisma.user.create({
        data: {
          email: 'usage@test.com',
          password: 'hash',
          name: 'Usage Test User',
          role: 'Department Executive',
          department: 'Test Department'
        }
      });

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
      await prisma.monthlyBudget.delete({ where: { id: testBudget.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    describe('GET /api/department-budget/usage/:departmentId', () => {
      test('should return budget usage summary', async () => {
        const res = await request(app).get(`/api/department-budget/usage/${testDept.id}?year=2026&month=8`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('allocatedAmount');
        expect(res.body.data).toHaveProperty('spentAmount');
        expect(res.body.data).toHaveProperty('remainingAmount');
        expect(res.body.data).toHaveProperty('usagePercentage');
      });

      test('should return 404 for non-existent budget', async () => {
        const res = await request(app).get(`/api/department-budget/usage/99999?year=2026&month=12`);

        expect(res.status).toBe(404);
      });
    });

    describe('POST /api/department-budget/usage/deduct', () => {
      test('should deduct budget for approved PR', async () => {
        const res = await request(app)
          .post('/api/department-budget/usage/deduct')
          .send({
            prPayload: {
              status: 'APPROVED',
              createdAt: '2026-08-15',
              requestedBy: testUser.id,
              lineItems: [{ quantity: 5, unitPrice: 100 }]
            }
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.deductedAmount).toBe(500);
      });
    });
  });

  describe('Budget Prediction Retrieval Endpoints', () => {
    let testPrediction, testUser;

    beforeAll(async () => {
      // Clean up any existing test user
      await prisma.user.deleteMany({ where: { email: 'prediction@test.com' } });

      testUser = await prisma.user.create({
        data: {
          email: 'prediction@test.com',
          password: 'hash',
          name: 'Prediction Test User',
          role: 'Department Executive',
          department: 'Test Department'
        }
      });

      testPrediction = await prisma.budgetPrediction.create({
        data: {
          departmentId: testDept.id,
          targetYear: 2026,
          targetMonth: 9,
          predictedAmount: 85000,
          confidence: 'high',
          algorithm: 'holt-winters',
          aiInsights: 'Based on 6 months of historical data',
          triggerType: 'manual',
          categoryBreakdown: {
            salaries: 50000,
            operations: 35000
          }
        }
      });
    });

    afterAll(async () => {
      await prisma.budgetPrediction.delete({ where: { id: testPrediction.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    describe('GET /api/department-budget/predictions/:departmentId', () => {
      test('should return all predictions for department', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty('predictedAmount');
        expect(res.body.data[0]).toHaveProperty('confidence');
      });

      test('should filter predictions by year and month', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/${testDept.id}?year=2026&month=9`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.every(p => p.targetYear === 2026 && p.targetMonth === 9)).toBe(true);
      });

      test('should filter predictions by confidence level', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/${testDept.id}?confidence=high`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.every(p => p.confidence === 'high')).toBe(true);
      });

      test('should filter predictions by trigger type', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/${testDept.id}?triggerType=manual`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.every(p => p.triggerType === 'manual')).toBe(true);
      });

      test('should limit results when limit parameter provided', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/${testDept.id}?limit=5`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
      });
    });

    describe('GET /api/department-budget/predictions/single/:id', () => {
      test('should return single prediction by ID', async () => {
        const res = await request(app).get(`/api/department-budget/predictions/single/${testPrediction.id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(testPrediction.id);
        expect(res.body.data).toHaveProperty('department');
      });

      test('should return 404 for non-existent prediction', async () => {
        const res = await request(app).get('/api/department-budget/predictions/single/99999');

        expect(res.status).toBe(404);
      });
    });
  });

  describe('Historical Comparison and Analytics Endpoints', () => {
    let testHistoricalBudgets;

    beforeAll(async () => {
      // Create historical budget data (6 months)
      testHistoricalBudgets = [];
      for (let i = 0; i < 6; i++) {
        const month = 3 + i; // March to August
        const budget = await prisma.monthlyBudget.create({
          data: {
            departmentId: testDept.id,
            year: 2026,
            month,
            allocatedAmount: 100000,
            spentAmount: 75000 + (i * 2000),
            reservedAmount: 5000
          }
        });
        testHistoricalBudgets.push(budget);
      }
    });

    afterAll(async () => {
      await prisma.monthlyBudget.deleteMany({
        where: { id: { in: testHistoricalBudgets.map(b => b.id) } }
      });
    });

    describe('GET /api/department-budget/historical/:departmentId', () => {
      test('should return historical data with last-3-months preset', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?preset=last-3-months`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('historicalData');
        expect(res.body.data).toHaveProperty('summary');
        expect(res.body.data.historicalData.length).toBeLessThanOrEqual(3);
        expect(res.body.data.summary).toHaveProperty('avgAllocated');
        expect(res.body.data.summary).toHaveProperty('avgSpent');
        expect(res.body.data.summary).toHaveProperty('avgUtilization');
      });

      test('should return historical data with last-6-months preset', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?preset=last-6-months`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.historicalData.length).toBeLessThanOrEqual(6);
      });

      test('should return historical data with year-over-year preset', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?preset=year-over-year`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      test('should return historical data with custom date range', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?startDate=2026-03&endDate=2026-05`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.historicalData.length).toBeLessThanOrEqual(3);
      });

      test('should calculate summary statistics correctly', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?preset=last-3-months`);

        expect(res.status).toBe(200);
        expect(res.body.data.summary.totalAllocated).toBeGreaterThan(0);
        expect(res.body.data.summary.totalSpent).toBeGreaterThan(0);
        expect(res.body.data.summary.avgUtilization).toBeGreaterThan(0);
      });

      test('should return 400 for invalid (non-numeric) departmentId', async () => {
        const res = await request(app).get('/api/department-budget/historical/invalid-id?preset=last-3-months');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid department ID');
      });

      test('should return 404 for non-existent departmentId', async () => {
        const res = await request(app).get('/api/department-budget/historical/99999?preset=last-3-months');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Department not found');
      });

      test('should return 400 for malformed date format', async () => {
        const res = await request(app).get(`/api/department-budget/historical/${testDept.id}?startDate=2026/03&endDate=2026-05`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid date format. Use YYYY-MM');
      });
    });

    describe('GET /api/department-budget/spending-trends/:departmentId', () => {
      let testPRRecord;

      beforeAll(async () => {
        // Create test purchase request record with JSON payload
        testPRRecord = await prisma.purchaseRequestRecord.create({
          data: {
            localId: `PR-TEST-${Date.now()}`,
            payload: {
              status: 'APPROVED',
              departmentId: testDept.id,
              requestorId: 1,
              lineItems: [
                {
                  itemCategory: 'Office Supplies',
                  description: 'Paper',
                  quantity: 10,
                  unitPrice: 50
                },
                {
                  itemCategory: 'Equipment',
                  description: 'Laptop',
                  quantity: 2,
                  unitPrice: 1500
                }
              ]
            }
          }
        });
      });

      afterAll(async () => {
        await prisma.purchaseRequestRecord.delete({
          where: { localId: testPRRecord.localId }
        });
      });

      test('should return spending trends by category and month', async () => {
        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('byCategory');
        expect(res.body.data).toHaveProperty('byMonth');
        expect(res.body.data).toHaveProperty('totalSpent');
      });

      test('should return spending trends with date range filter', async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const dateRange = `${year}-${month}`;

        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}?startDate=${dateRange}&endDate=${dateRange}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      test('should aggregate spending by category correctly', async () => {
        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}`);

        expect(res.status).toBe(200);

        if (res.body.data.byCategory.length > 0) {
          const officeSupplies = res.body.data.byCategory.find(c => c.category === 'Office Supplies');
          const equipment = res.body.data.byCategory.find(c => c.category === 'Equipment');

          if (officeSupplies) {
            expect(officeSupplies.amount).toBe(500);
          }
          if (equipment) {
            expect(equipment.amount).toBe(3000);
          }
        }
      });

      test('should aggregate spending by month correctly', async () => {
        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.byMonth).toBeDefined();
        expect(Array.isArray(res.body.data.byMonth)).toBe(true);
      });

      test('should calculate total spent correctly', async () => {
        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.totalSpent).toBeGreaterThanOrEqual(0);
      });

      test('should return 400 for invalid (non-numeric) departmentId', async () => {
        const res = await request(app).get('/api/department-budget/spending-trends/invalid-id');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid department ID');
      });

      test('should return 404 for non-existent departmentId', async () => {
        const res = await request(app).get('/api/department-budget/spending-trends/99999');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Department not found');
      });

      test('should return 400 for malformed date format', async () => {
        const res = await request(app).get(`/api/department-budget/spending-trends/${testDept.id}?startDate=2026/03&endDate=2026-05`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid date format. Use YYYY-MM');
      });
    });
  });
});
