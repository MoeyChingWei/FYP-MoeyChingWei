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
});
