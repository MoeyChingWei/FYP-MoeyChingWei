import { likelihoodWeight } from './upcoming-event-service.js';

const roundMoney = (value) => Number(Math.max(0, value).toFixed(2));

function historicalVolatilityRate(historicalData = []) {
  const amounts = historicalData.map(item => Number(item.amount)).filter(Number.isFinite);
  if (amounts.length < 3) return 0;
  const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  if (mean <= 0) return 0;
  const variance = amounts.reduce((sum, amount) => sum + ((amount - mean) ** 2), 0) / amounts.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;
  if (coefficientOfVariation >= 0.6) return 0.12;
  if (coefficientOfVariation >= 0.35) return 0.08;
  if (coefficientOfVariation >= 0.15) return 0.04;
  return 0.01;
}

function growthRate(historicalData = []) {
  const amounts = historicalData.map(item => Number(item.amount)).filter(Number.isFinite);
  if (amounts.length < 4) return 0;
  const groupSize = Math.min(3, Math.floor(amounts.length / 2));
  const earlier = amounts.slice(0, groupSize).reduce((sum, amount) => sum + amount, 0) / groupSize;
  const recent = amounts.slice(-groupSize).reduce((sum, amount) => sum + amount, 0) / groupSize;
  return earlier > 0 ? (recent - earlier) / earlier : 0;
}

/**
 * Adds transparent uncertainty handling to, rather than replacing, the AI
 * ensemble forecast. Events are future-only records, so they cannot duplicate
 * historical actual spend used by the base model.
 */
export function calculateRiskAdjustedForecast({ baseForecast, historicalData = [], requestSignals = [], upcomingEvents = [] }) {
  const base = Math.max(0, Number(baseForecast) || 0);
  const contributors = [];
  let reserveRate = historicalVolatilityRate(historicalData);
  if (reserveRate > 0) contributors.push({ type: 'volatility', label: 'Historical spending volatility', rate: reserveRate });

  const trend = growthRate(historicalData);
  const trendRate = trend >= 0.25 ? 0.08 : trend >= 0.1 ? 0.04 : 0;
  reserveRate += trendRate;
  if (trendRate > 0) contributors.push({ type: 'growth', label: 'Recent spending growth', rate: trendRate, growthRate: Number((trend * 100).toFixed(1)) });

  const recentSignals = requestSignals.filter(signal => signal?.riskWeight > 0);
  const emergencyCount = recentSignals.filter(signal => signal.type === 'emergency').length;
  const signalRate = Math.min(0.09, emergencyCount * 0.03 + recentSignals.filter(signal => signal.type === 'project').length * 0.015);
  reserveRate += signalRate;
  if (signalRate > 0) contributors.push({ type: 'request_signals', label: `${emergencyCount} urgent and ${recentSignals.length - emergencyCount} non-routine request signal(s)`, rate: signalRate });

  // Keep reserves proportionate and explainable; known events remain separate.
  reserveRate = Math.min(0.25, reserveRate);
  const contingencyReserve = roundMoney(base * reserveRate);
  const activeEvents = upcomingEvents.filter(event => event?.status === undefined || event.status === 'active');
  const expectedEventImpact = roundMoney(activeEvents.reduce(
    (sum, event) => sum + (Number(event.estimatedImpact) || 0) * likelihoodWeight(event.likelihood), 0,
  ));
  const stressEventImpact = roundMoney(activeEvents.reduce((sum, event) => sum + (Number(event.estimatedImpact) || 0), 0));
  for (const event of activeEvents) {
    contributors.push({
      type: 'upcoming_event', label: event.title, amount: roundMoney(Number(event.estimatedImpact) || 0), likelihood: event.likelihood,
    });
  }

  const recommended = roundMoney(base + contingencyReserve + expectedEventImpact);
  return {
    baseForecast: roundMoney(base),
    contingencyReserve,
    reserveRate: Number((reserveRate * 100).toFixed(1)),
    expectedEventImpact,
    contributors,
    scenarios: {
      conservative: roundMoney(base),
      recommended,
      highRisk: roundMoney(base + contingencyReserve * 1.5 + stressEventImpact),
    },
  };
}
