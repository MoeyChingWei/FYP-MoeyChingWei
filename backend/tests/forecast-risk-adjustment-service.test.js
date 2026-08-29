import { describe, expect, test } from 'vitest';
import { calculateRiskAdjustedForecast } from '../services/forecast-risk-adjustment-service.js';

describe('risk-adjusted forecast calculation', () => {
  test('keeps the base forecast separate from reserve and future events', () => {
    const result = calculateRiskAdjustedForecast({
      baseForecast: 10000,
      historicalData: [{ amount: 5000 }, { amount: 12000 }, { amount: 6000 }, { amount: 13000 }],
      requestSignals: [{ type: 'emergency', riskWeight: 3 }, { type: 'project', riskWeight: 2 }],
      upcomingEvents: [
        { title: 'Annual maintenance', estimatedImpact: 3000, likelihood: 'high', status: 'active' },
        { title: 'Possible event', estimatedImpact: 2000, likelihood: 'low', status: 'active' },
      ],
    });

    expect(result.baseForecast).toBe(10000);
    expect(result.contingencyReserve).toBeGreaterThan(0);
    expect(result.expectedEventImpact).toBe(3600);
    expect(result.scenarios.recommended).toBe(result.baseForecast + result.contingencyReserve + result.expectedEventImpact);
    expect(result.scenarios.highRisk).toBeGreaterThan(result.scenarios.recommended);
    expect(result.contributors).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'upcoming_event', label: 'Annual maintenance' })]));
  });

  test('does not add a reserve when no uncertainty evidence exists', () => {
    const result = calculateRiskAdjustedForecast({ baseForecast: 5000, historicalData: [{ amount: 5000 }, { amount: 5000 }, { amount: 5000 }] });
    expect(result.contingencyReserve).toBe(50);
    expect(result.expectedEventImpact).toBe(0);
    expect(result.scenarios.recommended).toBe(5050);
  });
});
