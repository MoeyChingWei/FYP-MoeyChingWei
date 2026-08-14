import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/prisma/client/index.js';
import pg from "pg";
import { callAnalyticsAgent } from '../services/budget-prediction-service.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Analytics Agent Integration', () => {
  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  test('should format historical data for AI', async () => {
    const mockDept = { id: 1, code: 'ENG', name: 'Engineering' };
    const mockHistory = [
      { period: '2026-05', amount: 50000, requestCount: 10, categoryTotals: { Materials: 30000, Services: 20000 } },
      { period: '2026-06', amount: 55000, requestCount: 12, categoryTotals: { Materials: 32000, Services: 23000 } },
      { period: '2026-07', amount: 58000, requestCount: 11, categoryTotals: { Materials: 35000, Services: 23000 } }
    ];

    const result = await callAnalyticsAgent(mockDept, mockHistory, 2026, 8);

    expect(result.amount).toBeGreaterThan(0);
    expect(result.confidence).toMatch(/^(low|medium|high)$/);
    expect(result.insights).toBeDefined();
    expect(typeof result.insights).toBe('string');
    expect(result.categoryBreakdown).toBeDefined();
  });

  test('should handle AI response parsing', async () => {
    const mockDept = { id: 1, code: 'ENG', name: 'Engineering' };
    const mockHistory = [
      { period: '2026-07', amount: 60000, requestCount: 10, categoryTotals: {} }
    ];

    const result = await callAnalyticsAgent(mockDept, mockHistory, 2026, 8);

    expect(result.comparisonData).toBeDefined();
    expect(result.comparisonData.lastMonthAmount).toBeDefined();
    expect(result.comparisonData.avgAmount).toBeDefined();
  });
});
