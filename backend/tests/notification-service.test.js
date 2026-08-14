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
});
