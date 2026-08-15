import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";
import { generateDepartmentPrediction } from '../services/budget-prediction-service.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Budget Prediction Service', () => {
  let testDept;
  let newDept;
  let testUser;

  beforeAll(async () => {
    const timestamp = Date.now();

    // Create test user for notifications
    testUser = await prisma.user.create({
      data: {
        email: `pred-test-${timestamp}@example.com`,
        password: 'hash',
        name: 'Prediction Test User',
        role: 'Department Executive',
        isActive: true
      }
    });

    testDept = await prisma.department.create({
      data: { code: `PSVC${timestamp}`.substring(0, 10), name: 'Prediction Service Test' }
    });

    newDept = await prisma.department.create({
      data: { code: `NEWD${timestamp}`.substring(0, 10), name: 'New Department' }
    });
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.budgetPrediction.deleteMany({
      where: {
        departmentId: {
          in: [testDept.id, newDept.id]
        }
      }
    });
    await prisma.department.delete({ where: { id: testDept.id } });
    await prisma.department.delete({ where: { id: newDept.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
    await pool.end();
  });

  beforeEach(async () => {
    // Clean up predictions before each test
    await prisma.budgetPrediction.deleteMany({
      where: {
        departmentId: {
          in: [testDept.id, newDept.id]
        }
      }
    });
  });

  test('should generate prediction for department with history', async () => {
    const prediction = await generateDepartmentPrediction(testDept.code, 2026, 9, null);

    expect(prediction).toBeDefined();
    expect(prediction.departmentId).toBe(testDept.id);
    expect(prediction.targetYear).toBe(2026);
    expect(prediction.targetMonth).toBe(9);
    expect(prediction.predictedAmount).toBeDefined();
    expect(parseFloat(prediction.predictedAmount)).toBeGreaterThan(0);
    expect(prediction.confidence).toMatch(/^(low|medium|high)$/);
    expect(prediction.algorithm).toBeDefined();
  });

  test('should handle new department with no history', async () => {
    const prediction = await generateDepartmentPrediction(newDept.code, 2026, 10, testUser.id);

    expect(prediction).toBeDefined();
    expect(prediction.departmentId).toBe(newDept.id);
    expect(prediction.targetYear).toBe(2026);
    expect(prediction.targetMonth).toBe(10);
    expect(parseFloat(prediction.predictedAmount)).toBe(50000);
    expect(prediction.confidence).toBe('low');
    expect(prediction.algorithm).toBe('default');
    expect(prediction.aiInsights).toContain('No historical data available');
    expect(prediction.triggerType).toBe('manual');
  });

  test('should throw error when department not found', async () => {
    await expect(
      generateDepartmentPrediction('NONEXISTENT', 2026, 11, null)
    ).rejects.toThrow('Department not found: NONEXISTENT');
  });

  test('should fallback to average when AI agent fails', async () => {
    // Create a test user for PSVC department
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User PSVC',
        email: `test-psvc-${Date.now()}@test.com`,
        password: 'test123',
        role: 'user',
        department: 'PSVC'
      }
    });

    // Create purchase request history for PSVC department
    const testLocalId = `test-pr-${Date.now()}`;
    await prisma.purchaseRequestRecord.create({
      data: {
        localId: testLocalId,
        payload: {
          department: 'Prediction Service Test',
          status: 'APPROVED',
          requestorId: testUser.id,
          lineItems: [
            { itemName: 'Test Item', itemCategory: 'Materials', quantity: 10, unitPrice: 100, totalPrice: 1000 }
          ]
        }
      }
    });

    // Mock the analytics agent to throw an error
    const originalChat = analyticsAgent.chat;
    analyticsAgent.chat = vi.fn().mockRejectedValue(new Error('AI agent failed'));

    const prediction = await generateDepartmentPrediction('PSVC', 2026, 12, null);

    expect(prediction).toBeDefined();
    expect(prediction.aiInsights).toContain('AI error');
    expect(parseFloat(prediction.predictedAmount)).toBeGreaterThan(0);

    // Restore original function
    analyticsAgent.chat = originalChat;

    // Clean up test data
    await prisma.purchaseRequestRecord.delete({
      where: { localId: testLocalId }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
  });
});

