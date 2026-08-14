import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '../config/prisma.js';
import { deductBudgetForPR, checkBudgetThresholds } from '../services/budget-deduction-service.js';
import * as notificationService from '../services/notification-service.js';

vi.mock('../services/notification-service.js');

describe('Budget Deduction Service', () => {
  let testDept, testUser, testBudget;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.user.deleteMany({ where: { email: 'deduct@test.com' } });
    await prisma.department.deleteMany({ where: { code: 'DEDUCT' } });

    testDept = await prisma.department.create({
      data: { code: 'DEDUCT', name: 'Deduction Test' }
    });

    testUser = await prisma.user.create({
      data: {
        email: 'deduct@test.com',
        password: 'hash',
        name: 'Test User',
        department: 'Deduction Test',
        role: 'Department Executive'
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
    await prisma.monthlyBudget.deleteMany({ where: { departmentId: testDept.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.$disconnect();
  });

  test('deductBudgetForPR should deduct amount when PR approved', async () => {
    const prPayload = {
      status: 'APPROVED',
      createdAt: '2026-08-15',
      requestedBy: testUser.id,
      lineItems: [
        { quantity: 10, unitPrice: 500 },
        { quantity: 5, unitPrice: 1000 }
      ]
    };

    const result = await deductBudgetForPR(prPayload);

    expect(result.success).toBe(true);
    expect(result.deductedAmount).toBe(10000);

    const updatedBudget = await prisma.monthlyBudget.findUnique({
      where: { id: testBudget.id }
    });

    expect(parseFloat(updatedBudget.spentAmount)).toBe(10000);
  });

  test('checkBudgetThresholds should trigger warning at 80%', async () => {
    notificationService.notifyBudgetThreshold.mockResolvedValue();

    await prisma.monthlyBudget.update({
      where: { id: testBudget.id },
      data: { spentAmount: 80000 }
    });

    const warnings = await checkBudgetThresholds(testBudget.id);

    expect(warnings.length).toBe(1);
    expect(warnings[0].threshold).toBe(80);
    expect(notificationService.notifyBudgetThreshold).toHaveBeenCalledWith(
      testUser.id,
      testDept.name,
      2026,
      8,
      80,
      80000,
      100000,
      testBudget.id
    );
  });

  test('checkBudgetThresholds should trigger exceeded at 100%+', async () => {
    notificationService.notifyBudgetExceeded.mockResolvedValue({});

    await prisma.monthlyBudget.update({
      where: { id: testBudget.id },
      data: { spentAmount: 105000 }
    });

    const warnings = await checkBudgetThresholds(testBudget.id);

    expect(warnings.length).toBe(1);
    expect(warnings[0].threshold).toBe(100);
    expect(notificationService.notifyBudgetExceeded).toHaveBeenCalled();
  });

  test('deductBudgetForPR should not deduct if status not APPROVED', async () => {
    const prPayload = {
      status: 'PENDING',
      createdAt: '2026-08-15',
      requestedBy: testUser.id,
      lineItems: [{ quantity: 1, unitPrice: 1000 }]
    };

    const result = await deductBudgetForPR(prPayload);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('PR not approved');
  });

  test('deductBudgetForPR should handle user without department', async () => {
    const userNoDept = await prisma.user.create({
      data: { email: 'nodept@test.com', password: 'hash', name: 'No Dept', department: null }
    });

    const prPayload = {
      status: 'APPROVED',
      createdAt: '2026-08-15',
      requestedBy: userNoDept.id,
      lineItems: [{ quantity: 1, unitPrice: 1000 }]
    };

    const result = await deductBudgetForPR(prPayload);

    expect(result.success).toBe(false);
    expect(result.reason).toContain('No department');

    await prisma.user.delete({ where: { id: userNoDept.id } });
  });
});
