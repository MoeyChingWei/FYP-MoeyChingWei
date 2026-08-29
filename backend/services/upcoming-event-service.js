const LIKELIHOODS = new Set(['low', 'medium', 'high']);

export function validateUpcomingEvent(input = {}) {
  const title = String(input.title ?? '').trim();
  const targetYear = Number(input.targetYear);
  const targetMonth = Number(input.targetMonth);
  const estimatedImpact = Number(input.estimatedImpact);
  const likelihood = String(input.likelihood ?? 'medium').trim().toLowerCase();

  if (!title || title.length > 160) return { valid: false, message: 'title is required and must be 160 characters or fewer' };
  if (!Number.isInteger(targetYear) || targetYear < 2000 || targetYear > 2100) return { valid: false, message: 'targetYear must be between 2000 and 2100' };
  if (!Number.isInteger(targetMonth) || targetMonth < 1 || targetMonth > 12) return { valid: false, message: 'targetMonth must be between 1 and 12' };
  if (!Number.isFinite(estimatedImpact) || estimatedImpact <= 0) return { valid: false, message: 'estimatedImpact must be a positive number' };
  if (!LIKELIHOODS.has(likelihood)) return { valid: false, message: 'likelihood must be low, medium, or high' };

  return {
    valid: true,
    value: {
      title,
      targetYear,
      targetMonth,
      estimatedImpact: Number(estimatedImpact.toFixed(2)),
      likelihood,
      notes: String(input.notes ?? '').trim() || null,
    },
  };
}

export function likelihoodWeight(likelihood) {
  return ({ low: 0.3, medium: 0.6, high: 1 }[String(likelihood).toLowerCase()] ?? 0);
}
