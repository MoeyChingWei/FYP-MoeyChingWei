import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../config/prisma.js';
import { handleNewDepartment, findSimilarDepartments } from '../services/budget-prediction-service.js';

describe('New Department Handling', () => {
  let newDept, existingDept, testUser;

  beforeAll(async () => {
    const timestamp = Date.now();
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);

    existingDept = await prisma.department.create({
      data: { code: `O${uniqueSuffix}`.substring(0, 10), name: `Old Marketing ${timestamp}`, isActive: true }
    });
    newDept = await prisma.department.create({
      data: { code: `N${uniqueSuffix}`.substring(0, 10), name: `New Marketing ${timestamp}`, isActive: true }
    });
    testUser = await prisma.user.create({
      data: {
        email: `oldm-${timestamp}-${uniqueSuffix}@test.com`,
        password: 'hash',
        name: 'Old Marketing User',
        role: 'Department Executive',
        department: existingDept.code,
        isActive: true
      }
    });

    await prisma.purchaseRequestRecord.create({
      data: {
        localId: `PR-OLDM-${timestamp}-${uniqueSuffix}`,
        payload: {
          status: 'APPROVED',
          requestorId: testUser.id,
          lineItems: [{ itemName: 'Item', quantity: 10, unitPrice: 1000, itemCategory: 'Marketing' }]
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.purchaseRequestRecord.deleteMany({ where: { localId: { contains: 'PR-OLDM-' } } });
    if (testUser) await prisma.user.delete({ where: { id: testUser.id } });
    if (existingDept) await prisma.department.delete({ where: { id: existingDept.id } });
    if (newDept) await prisma.department.delete({ where: { id: newDept.id } });
    await prisma.$disconnect();
  });

  test('should find similar departments by name pattern', async () => {
    const similar = await findSimilarDepartments(newDept.id);

    expect(similar.length).toBeGreaterThan(0);
    expect(similar[0].name).toContain('Old Marketing');
  });

  test('should create prediction based on similar department', async () => {
    const prediction = await handleNewDepartment(newDept.id, 2026, 9);

    expect(prediction.departmentId).toBe(newDept.id);
    expect(prediction.confidence).toBe('low');
    expect(prediction.aiInsights).toContain('similar department');
    expect(Number(prediction.predictedAmount)).toBeGreaterThan(0);
  });
});
