import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../config/prisma.js';
import { handleNewDepartment, findSimilarDepartments } from '../services/budget-prediction-service.js';

describe('New Department Handling', () => {
  let newDept, existingDept, testUser;

  beforeAll(async () => {
    existingDept = await prisma.department.create({
      data: { code: 'OLDM', name: 'Old Marketing' }
    });
    newDept = await prisma.department.create({
      data: { code: 'NEWM', name: 'New Marketing' }
    });
    testUser = await prisma.user.create({
      data: { email: 'oldm@test.com', password: 'hash', department: 'OLDM' }
    });

    await prisma.purchaseRequestRecord.create({
      data: {
        localId: 'PR-OLDM-001',
        payload: {
          status: 'APPROVED',
          requestorId: testUser.id,
          lineItems: [{ itemName: 'Item', quantity: 10, unitPrice: 1000, itemCategory: 'Marketing' }]
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.purchaseRequestRecord.deleteMany({});
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.department.deleteMany({});
    await prisma.$disconnect();
  });

  test('should find similar departments by name pattern', async () => {
    const similar = await findSimilarDepartments(newDept.id);

    expect(similar.length).toBeGreaterThan(0);
    expect(similar[0].name).toBe('Old Marketing');
  });

  test('should create prediction based on similar department', async () => {
    const prediction = await handleNewDepartment(newDept.id, 2026, 9);

    expect(prediction.departmentId).toBe(newDept.id);
    expect(prediction.confidence).toBe('low');
    expect(prediction.aiInsights).toContain('similar department');
    expect(Number(prediction.predictedAmount)).toBeGreaterThan(0);
  });
});
