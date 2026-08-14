import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../config/prisma.js';
import {
  sendNotification,
  notifyBudgetPredictionReady,
  notifyBudgetThreshold,
  notifyBudgetAdjustmentRequested,
  notifyBudgetAdjustmentApproved,
  notifyBudgetAdjustmentRejected,
  notifyBudgetExceeded,
  notifyNewDepartmentSuggestion
} from '../services/notification-service.js';

describe('Notification Service', () => {
  let testUser;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: { email: 'notif@test.com', password: 'hash', name: 'Test User' }
    });
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  test('sendNotification should create notification', async () => {
    const notif = await sendNotification({
      userId: testUser.id,
      type: 'INFO',
      title: 'Test',
      message: 'Test message'
    });

    expect(notif.userId).toBe(testUser.id);
    expect(notif.title).toBe('Test');
    expect(notif.isRead).toBe(false);
  });

  test('notifyBudgetPredictionReady should create prediction notification', async () => {
    const notif = await notifyBudgetPredictionReady(testUser.id, 'Engineering', 2026, 9, 75000, 123);

    expect(notif.type).toBe('BUDGET_PREDICTION_READY');
    expect(notif.message).toContain('Engineering');
    expect(notif.message).toContain('75000');
    expect(notif.refType).toBe('budget_prediction');
    expect(notif.refId).toBe('123');
  });

  test('notifyBudgetThreshold should create threshold notification', async () => {
    const notif = await notifyBudgetThreshold(testUser.id, 'Marketing', 2026, 8, 80, 80000, 100000, 456);

    expect(notif.type).toBe('BUDGET_THRESHOLD_WARNING');
    expect(notif.message).toContain('80%');
    expect(notif.message).toContain('Marketing');
    expect(notif.refType).toBe('monthly_budget');
    expect(notif.refId).toBe('456');
  });

  test('notifyBudgetAdjustmentRequested should create adjustment request notification', async () => {
    const notif = await notifyBudgetAdjustmentRequested(testUser.id, 'Finance Manager', 'Engineering', 2026, 9, 25000, 'Emergency equipment', 321);

    expect(notif.userId).toBe(testUser.id);
    expect(notif.type).toBe('BUDGET_ADJUSTMENT_REQUESTED');
    expect(notif.message).toContain('25000');
    expect(notif.refType).toBe('budget_adjustment_request');
  });

  test('notifyBudgetExceeded should create exceeded notification', async () => {
    const notif = await notifyBudgetExceeded(testUser.id, 'Sales', 2026, 8, 105, 105000, 100000, 654);

    expect(notif.type).toBe('BUDGET_EXCEEDED');
    expect(notif.message).toContain('105%');
    expect(notif.message).toContain('exceeded');
  });

  test('notifyBudgetAdjustmentApproved should create approval notification', async () => {
    const notif = await notifyBudgetAdjustmentApproved(testUser.id, 'Engineering', 2026, 9, 25000, 125000, 321);

    expect(notif.type).toBe('BUDGET_ADJUSTMENT_APPROVED');
    expect(notif.title).toBe('Budget Adjustment Approved');
    expect(notif.message).toContain('25000.00');
    expect(notif.message).toContain('125000.00');
    expect(notif.message).toContain('approved');
    expect(notif.refType).toBe('budget_adjustment_request');
    expect(notif.refId).toBe('321');
  });

  test('notifyBudgetAdjustmentRejected should create rejection notification', async () => {
    const notif = await notifyBudgetAdjustmentRejected(testUser.id, 'Marketing', 2026, 8, 15000, 'Insufficient funds', 456);

    expect(notif.type).toBe('BUDGET_ADJUSTMENT_REJECTED');
    expect(notif.title).toBe('Budget Adjustment Rejected');
    expect(notif.message).toContain('15000.00');
    expect(notif.message).toContain('rejected');
    expect(notif.message).toContain('Insufficient funds');
    expect(notif.refType).toBe('budget_adjustment_request');
    expect(notif.refId).toBe('456');
  });

  test('notifyNewDepartmentSuggestion should create department suggestion notification', async () => {
    const notif = await notifyNewDepartmentSuggestion(testUser.id, 'Data Science', 85000, 'Engineering', 0.87);

    expect(notif.type).toBe('NEW_DEPARTMENT_SUGGESTION');
    expect(notif.title).toBe('New Department Budget Suggestion');
    expect(notif.message).toContain('Data Science');
    expect(notif.message).toContain('85000.00');
    expect(notif.message).toContain('87%');
    expect(notif.message).toContain('Engineering');
    expect(notif.refType).toBe('department');
    expect(notif.refId).toBe('Data Science');
  });
});
