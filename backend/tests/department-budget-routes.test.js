import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import prisma from '../config/prisma.js';
import departmentRouter from '../routes/department-budget.js';

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
});
