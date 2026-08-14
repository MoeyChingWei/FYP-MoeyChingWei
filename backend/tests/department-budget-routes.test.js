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
    test('should return all departments', async () => {
      const res = await request(app)
        .get('/api/department-budget/departments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
