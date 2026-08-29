import { describe, expect, test } from 'vitest';
import { likelihoodWeight, validateUpcomingEvent } from '../services/upcoming-event-service.js';

describe('upcoming event validation', () => {
  test('normalizes a valid manager event', () => {
    expect(validateUpcomingEvent({
      title: ' Annual maintenance ', targetYear: '2026', targetMonth: '9',
      estimatedImpact: '3500.567', likelihood: 'HIGH', notes: '  Vendor confirmation pending ',
    })).toEqual({
      valid: true,
      value: {
        title: 'Annual maintenance', targetYear: 2026, targetMonth: 9,
        estimatedImpact: 3500.57, likelihood: 'high', notes: 'Vendor confirmation pending',
      },
    });
  });

  test('rejects invalid month, impact, and likelihood', () => {
    expect(validateUpcomingEvent({ title: 'Event', targetYear: 2026, targetMonth: 13, estimatedImpact: 1 }).valid).toBe(false);
    expect(validateUpcomingEvent({ title: 'Event', targetYear: 2026, targetMonth: 9, estimatedImpact: 0 }).valid).toBe(false);
    expect(validateUpcomingEvent({ title: 'Event', targetYear: 2026, targetMonth: 9, estimatedImpact: 1, likelihood: 'certain' }).valid).toBe(false);
  });

  test('uses explicit scenario weights', () => {
    expect(likelihoodWeight('low')).toBe(0.3);
    expect(likelihoodWeight('medium')).toBe(0.6);
    expect(likelihoodWeight('high')).toBe(1);
  });
});
