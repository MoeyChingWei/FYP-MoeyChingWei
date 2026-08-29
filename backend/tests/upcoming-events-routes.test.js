import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import express from 'express';
import request from 'supertest';
import prisma from '../config/prisma.js';
import departmentRouter from '../routes/department-budget.js';

const app = express();
app.use(express.json());

let manager;
let department;
app.use((req, res, next) => {
  req.user = {
    id: manager?.id,
    email: manager?.email,
    role: 'Manager',
    department: 'Unrelated Department',
    isActive: true,
  };
  next();
});
app.use('/api/department-budget', departmentRouter);

describe('upcoming forecast event routes', () => {
  beforeAll(async () => {
    const suffix = Date.now();
    manager = await prisma.user.create({
      data: { email: `forecast-manager-${suffix}@example.com`, password: 'hash', name: 'Forecast Manager', role: 'Manager' },
    });
    department = await prisma.department.create({
      data: { code: `FE${suffix}`.slice(0, 10), name: `Forecast Event ${suffix}`, updatedAt: new Date() },
    });
  });

  afterAll(async () => {
    if (department) await prisma.budgetUpcomingEvent.deleteMany({ where: { departmentId: department.id } });
    if (department) await prisma.department.delete({ where: { id: department.id } });
    if (manager) await prisma.user.delete({ where: { id: manager.id } });
    await prisma.$disconnect();
  });

  test('creates, lists, and cancels a manager-provided event', async () => {
    const created = await request(app)
      .post('/api/department-budget/upcoming-events')
      .send({ departmentId: department.id, title: 'Annual maintenance', targetYear: 2026, targetMonth: 9, estimatedImpact: 3500, likelihood: 'high' })
      .expect(201);

    expect(created.body.data).toMatchObject({ title: 'Annual maintenance', likelihood: 'high', status: 'active' });

    const listed = await request(app)
      .get(`/api/department-budget/upcoming-events/${department.id}?year=2026&month=9`)
      .expect(200);
    expect(listed.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: created.body.data.id })]));

    const cancelled = await request(app)
      .delete(`/api/department-budget/upcoming-events/${created.body.data.id}`)
      .expect(200);
    expect(cancelled.body.data.status).toBe('cancelled');
  });

  test('validates event impact before writing', async () => {
    const response = await request(app)
      .post('/api/department-budget/upcoming-events')
      .send({ departmentId: department.id, title: 'Invalid event', targetYear: 2026, targetMonth: 9, estimatedImpact: 0 })
      .expect(400);
    expect(response.body.message).toContain('estimatedImpact');
  });
});
