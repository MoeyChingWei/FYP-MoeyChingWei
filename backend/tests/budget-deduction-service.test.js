import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '../config/prisma.js';
import { deductBudgetForPR, checkBudgetThresholds } from '../services/budget-deduction-service.js';
import * as notificationService from '../services/notification-service.js';
import Decimal from 'decimal.js';

vi.mock('../services/notification-service.js');

describe('Budget Deduction Service', () => {
  let testDept, testUser, testBudget;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.user.deleteMany({ where: { email: 'deduct@test.com' } });
    await prisma.department.deleteMany({ where: { code: 'DEDUCT' } });

    testDept = await prisma.department.create({
      data: { code: 'DEDUCT', name: 'Deduction Test', isActive: true }
    });

    testUser = await prisma.user.create({
      data: {
        email: 'deduct@test.com',
        password: 'hash',
        name: 'Test User',
        department: 'DEDUCT',
        role: 'Department Executive',
        isActive: true
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

    expect(new Decimal(updatedBudget.spentAmount).toNumber()).toBe(10000);
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

  test('checkBudgetThresholds should notify all department executives in parallel', async () => {
    // Clear mocks and cleanup any leftover test data
    notificationService.notifyBudgetThreshold.mockClear();
    await prisma.user.deleteMany({ where: { email: { in: ['exec2@test.com', 'exec3@test.com'] } } });

    // Count existing executives before adding new ones
    const existingExecs = await prisma.user.count({
      where: {
        OR: [
          { department: { equals: testDept.code, mode: 'insensitive' } },
          { department: { equals: testDept.name, mode: 'insensitive' } }
        ],
        role: 'Department Executive',
        isActive: true
      }
    });

    // Create multiple department executives
    const exec2 = await prisma.user.create({
      data: {
        email: 'exec2@test.com',
        password: 'hash',
        name: 'Executive 2',
        department: 'Deduction Test',
        role: 'Department Executive',
        isActive: true
      }
    });

    const exec3 = await prisma.user.create({
      data: {
        email: 'exec3@test.com',
        password: 'hash',
        name: 'Executive 3',
        department: 'DEDUCT',
        role: 'Department Executive',
        isActive: true
      }
    });

    const expectedExecCount = existingExecs + 2;

    notificationService.notifyBudgetThreshold.mockResolvedValue();

    await prisma.monthlyBudget.update({
      where: { id: testBudget.id },
      data: { spentAmount: 85000, lastNotifiedThreshold: 0 }
    });

    const warnings = await checkBudgetThresholds(testBudget.id);

    expect(warnings.length).toBe(1);
    expect(warnings[0].threshold).toBe(80);

    // Verify all executives were notified
    expect(notificationService.notifyBudgetThreshold).toHaveBeenCalledTimes(expectedExecCount);

    // Verify parallel execution by checking the new executives were included
    const calls = notificationService.notifyBudgetThreshold.mock.calls;
    const notifiedUserIds = calls.map(call => call[0]);
    expect(notifiedUserIds).toContain(exec2.id);
    expect(notifiedUserIds).toContain(exec3.id);

    // Cleanup
    await prisma.user.delete({ where: { id: exec2.id } });
    await prisma.user.delete({ where: { id: exec3.id } });
  });

  test('checkBudgetThresholds should notify all executives at 100% threshold', async () => {
    // Clear mocks and cleanup any leftover test data
    notificationService.notifyBudgetThreshold.mockClear();
    notificationService.notifyBudgetExceeded.mockClear();
    await prisma.user.deleteMany({ where: { email: 'exec4@test.com' } });

    // Count existing executives
    const existingExecs = await prisma.user.count({
      where: {
        OR: [
          { department: { equals: testDept.code, mode: 'insensitive' } },
          { department: { equals: testDept.name, mode: 'insensitive' } }
        ],
        role: 'Department Executive',
        isActive: true
      }
    });

    const exec4 = await prisma.user.create({
      data: {
        email: 'exec4@test.com',
        password: 'hash',
        name: 'Executive 4',
        department: 'Deduction Test',
        role: 'Department Executive',
        isActive: true
      }
    });

    const expectedExecCount = existingExecs + 1;

    notificationService.notifyBudgetThreshold.mockResolvedValue();
    notificationService.notifyBudgetExceeded.mockResolvedValue();

    await prisma.monthlyBudget.update({
      where: { id: testBudget.id },
      data: { spentAmount: 110000, lastNotifiedThreshold: 0 }
    });

    const warnings = await checkBudgetThresholds(testBudget.id);

    // Should send both 80% and 100% warnings when jumping from 0% to 110%
    expect(warnings.length).toBe(2);
    expect(warnings.find(w => w.threshold === 80)).toBeTruthy();
    expect(warnings.find(w => w.threshold === 100)).toBeTruthy();

    // Verify all executives were notified for both thresholds (3 execs * 2 thresholds)
    // 80% threshold: notifyBudgetThreshold called for each exec
    // 100% threshold: notifyBudgetExceeded called for each exec
    expect(notificationService.notifyBudgetThreshold).toHaveBeenCalledTimes(expectedExecCount);
    expect(notificationService.notifyBudgetExceeded).toHaveBeenCalledTimes(expectedExecCount);

    // Verify the new executive was included in both notifications
    const thresholdCalls = notificationService.notifyBudgetThreshold.mock.calls;
    const exceededCalls = notificationService.notifyBudgetExceeded.mock.calls;
    const thresholdUserIds = thresholdCalls.map(call => call[0]);
    const exceededUserIds = exceededCalls.map(call => call[0]);
    expect(thresholdUserIds).toContain(exec4.id);
    expect(exceededUserIds).toContain(exec4.id);

    // Cleanup
    await prisma.user.delete({ where: { id: exec4.id } });
  });
});
