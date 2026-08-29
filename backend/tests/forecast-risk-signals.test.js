import { describe, expect, test } from 'vitest';
import { classifyPurchaseRequestForForecast } from '../services/forecast-risk-signals.js';

describe('forecast risk signal classification', () => {
  test('identifies an urgent replacement as an emergency signal', () => {
    const result = classifyPurchaseRequestForForecast({
      urgency: 'high',
      lineItems: [{
        itemName: 'Server',
        itemDescription: 'Urgent replacement for damaged production server',
        quantity: 1,
        unitPrice: 4500,
      }],
    });

    expect(result.type).toBe('emergency');
    expect(result.confidence).toBe('high');
    expect(result.amount).toBe(4500);
    expect(result.matchedKeywords).toEqual(expect.arrayContaining(['urgent', 'replacement', 'damaged']));
  });

  test('classifies a planned implementation as a project signal', () => {
    const result = classifyPurchaseRequestForForecast({
      lineItems: [{
        itemName: 'Software licence',
        itemDescription: 'New system implementation project licence',
        quantity: 2,
        unitPrice: 1000,
      }],
    });

    expect(result.type).toBe('project');
    expect(result.riskWeight).toBe(2);
    expect(result.amount).toBe(2000);
  });

  test('keeps ordinary requests unclassified without inventing a risk', () => {
    const result = classifyPurchaseRequestForForecast({
      lineItems: [{ itemName: 'Cable', quantity: 3, unitPrice: 10 }],
    });

    expect(result.type).toBe('unclassified');
    expect(result.riskWeight).toBe(0);
    expect(result.confidence).toBe('low');
  });
});
