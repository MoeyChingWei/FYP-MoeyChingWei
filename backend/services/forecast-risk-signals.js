const SIGNAL_DEFINITIONS = [
  {
    type: 'emergency',
    label: 'Emergency / unplanned purchase',
    keywords: ['emergency', 'urgent', 'breakdown', 'damaged', 'damage', 'repair', 'replace', 'replacement', 'failure', 'critical'],
    riskWeight: 3,
  },
  {
    type: 'project',
    label: 'Project or one-off purchase',
    keywords: ['project', 'implementation', 'rollout', 'launch', 'migration', 'renovation', 'upgrade', 'new system'],
    riskWeight: 2,
  },
  {
    type: 'maintenance',
    label: 'Maintenance requirement',
    keywords: ['maintenance', 'servicing', 'service contract', 'renewal', 'calibration', 'inspection'],
    riskWeight: 1,
  },
  {
    type: 'seasonal',
    label: 'Seasonal or event-related purchase',
    keywords: ['annual', 'year-end', 'year end', 'quarterly', 'event', 'conference', 'training', 'campaign', 'festive'],
    riskWeight: 1,
  },
  {
    type: 'routine',
    label: 'Routine operating purchase',
    keywords: ['monthly', 'recurring', 'routine', 'stationery', 'office supplies', 'consumable', 'toner'],
    riskWeight: 0,
  },
];

function getRequestText(payload = {}) {
  const items = Array.isArray(payload.lineItems)
    ? payload.lineItems
    : (Array.isArray(payload.items) ? payload.items : []);

  return [
    payload.notes,
    payload.description,
    ...items.flatMap(item => [item.itemName, item.itemDescription, item.itemCategory]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getAmount(payload = {}) {
  const items = Array.isArray(payload.lineItems)
    ? payload.lineItems
    : (Array.isArray(payload.items) ? payload.items : []);

  return items.reduce((total, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const explicitTotal = Number(item.amountAfterTax ?? item.totalPrice);
    const lineTotal = Number.isFinite(quantity) && Number.isFinite(unitPrice)
      ? quantity * unitPrice
      : explicitTotal;
    return total + (Number.isFinite(lineTotal) ? lineTotal : 0);
  }, 0);
}

/**
 * Classifies a PR with transparent, deterministic keyword rules. The result is
 * an AI-inferred forecasting signal only; it never changes the PR or asks the
 * requester to fill extra fields.
 */
export function classifyPurchaseRequestForForecast(payload = {}) {
  const text = getRequestText(payload);
  const urgency = String(payload.urgency ?? '').trim().toLowerCase();
  const matches = SIGNAL_DEFINITIONS.map(definition => ({
    ...definition,
    matches: definition.keywords.filter(keyword => text.includes(keyword)),
  })).filter(definition => definition.matches.length > 0);

  const emergencyFromUrgency = ['urgent', 'high', 'critical'].includes(urgency);
  const emergency = matches.find(match => match.type === 'emergency');
  const strongest = emergency || matches.sort((a, b) => b.riskWeight - a.riskWeight)[0];
  const type = emergencyFromUrgency || emergency ? 'emergency' : (strongest?.type ?? 'unclassified');
  const riskWeight = type === 'emergency'
    ? 3
    : (strongest?.riskWeight ?? 0);
  const matchedKeywords = [...new Set(matches.flatMap(match => match.matches))];
  const confidence = emergencyFromUrgency || matchedKeywords.length >= 2
    ? 'high'
    : matchedKeywords.length === 1
      ? 'medium'
      : 'low';

  return {
    type,
    label: type === 'emergency'
      ? 'Emergency / unplanned purchase'
      : (strongest?.label ?? 'No clear forecast signal'),
    confidence,
    riskWeight,
    matchedKeywords,
    amount: Number(getAmount(payload).toFixed(2)),
    source: 'ai_inferred_rules',
  };
}

export function getRequestTextForForecast(payload = {}) {
  return getRequestText(payload);
}
