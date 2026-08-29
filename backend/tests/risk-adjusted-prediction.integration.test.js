import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';
import { generateDepartmentPrediction } from '../services/budget-prediction-service.js';

describe('risk-adjusted prediction persistence', () => {
  let department;
  let user;
  const requestIds = [];

  beforeAll(async () => {
    const suffix = Date.now();
    department = await prisma.department.create({
      data: { code: `RA${suffix}`.slice(0, 10), name: `Risk Adjusted ${suffix}`, updatedAt: new Date() },
    });
    user = await prisma.user.create({
      data: { email: `risk-adjusted-${suffix}@example.com`, password: 'hash', name: 'Risk Analyst', role: 'Manager', department: department.code },
    });
    for (const [index, amount] of [1000, 1700, 1100].entries()) {
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - (3 - index));
      const localId = `risk-pr-${suffix}-${index}`;
      requestIds.push(localId);
      await prisma.purchaseRequestRecord.create({
        data: {
          localId,
          createdAt,
          updatedAt: createdAt,
          payload: {
            status: 'APPROVED', requestorId: user.id, createdAt: createdAt.toISOString(), urgency: index === 2 ? 'high' : 'normal',
            lineItems: [{ itemName: index === 2 ? 'Server' : 'Office item', itemDescription: index === 2 ? 'Urgent replacement after equipment failure' : 'Routine purchase', quantity: 1, unitPrice: amount }],
          },
        },
      });
    }
    const now = new Date();
    const targetMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const targetYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    await prisma.budgetUpcomingEvent.create({
      data: { departmentId: department.id, createdBy: user.id, title: 'Planned maintenance', targetYear, targetMonth, estimatedImpact: 500, likelihood: 'high' },
    });
    vi.spyOn(analyticsAgent, 'chat').mockResolvedValue({
      success: true,
      content: JSON.stringify({ predictedAmount: 1200, confidence: 'medium', insights: 'Test ensemble result', method: 'ensemble' }),
    });
  });

  afterAll(async () => {
    vi.restoreAllMocks();
    if (department) {
      await prisma.budgetPrediction.deleteMany({ where: { departmentId: department.id } });
      await prisma.budgetUpcomingEvent.deleteMany({ where: { departmentId: department.id } });
    }
    if (requestIds.length) await prisma.purchaseRequestRecord.deleteMany({ where: { localId: { in: requestIds } } });
    if (department) await prisma.department.delete({ where: { id: department.id } });
    if (user) await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  test('stores base forecast and risk-adjusted scenarios separately', async () => {
    const now = new Date();
    const targetMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const targetYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const prediction = await generateDepartmentPrediction(department.code, targetYear, targetMonth, null);
    const risk = prediction.comparisonData.riskAdjustment;

    expect(Number(prediction.predictedAmount)).toBe(1200);
    expect(risk.baseForecast).toBe(1200);
    expect(risk.expectedEventImpact).toBe(500);
    expect(risk.contingencyReserve).toBeGreaterThan(0);
    expect(risk.scenarios.recommended).toBe(1200 + risk.contingencyReserve + 500);
    expect(risk.contributors).toEqual(expect.arrayContaining([expect.objectContaining({ label: 'Planned maintenance' })]));

    const classifiedRequest = await prisma.purchaseRequestRecord.findUnique({ where: { localId: requestIds[2] } });
    expect(classifiedRequest.payload.forecastSignal).toMatchObject({ type: 'emergency', source: 'ai_inferred_rules' });
  });
});
