import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';
import Decimal from 'decimal.js';

// Constants for budget prediction thresholds
// Default budget for new departments with no historical data (MYR)
const DEFAULT_NEW_DEPARTMENT_BUDGET = 50000;

// Confidence thresholds based on historical data points
// High confidence: 12+ months of data (full year for seasonal patterns)
// Medium confidence: 6-11 months of data (half year minimum)
// Low confidence: <6 months of data (insufficient for reliable trends)
const CONFIDENCE_THRESHOLD_HIGH = 12;
const CONFIDENCE_THRESHOLD_MEDIUM = 6;

// Default fallback budget when no data exists (MYR)
const DEFAULT_FALLBACK_BUDGET = 100000;

/**
 * Get historical spending data aggregated by month for a department
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array<{period: string, amount: number, requestCount: number, categoryTotals: Object}>>} Historical spending data
 */
async function getHistoricalSpending(departmentId) {
  const department = await prisma.department.findUnique({
    where: { id: departmentId }
  });

  if (!department) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { department: { equals: department.code, mode: 'insensitive' } },
        { department: { equals: department.name, mode: 'insensitive' } }
      ]
    },
    select: { id: true }
  });

  const userIds = users.map(u => u.id);

  // Performance fix: Add date range filter (last 24 months)
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 24);

  const purchaseRequests = await prisma.purchaseRequestRecord.findMany({
    where: {
      createdAt: {
        gte: cutoffDate
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const approvedRequests = purchaseRequests.filter(pr => {
    const status = String(pr.payload?.status ?? '').trim().toUpperCase();
    const requestorId = pr.payload?.requestorId;
    return status === 'APPROVED' && userIds.includes(requestorId);
  });

  const aggregated = {};

  approvedRequests.forEach(request => {
    const date = new Date(request.createdAt);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!aggregated[period]) {
      aggregated[period] = {
        period,
        amount: 0,
        requestCount: 0,
        categoryTotals: {}
      };
    }

    // Schema fix: Use lineItems and unitPrice as specified in brief
    const items = request.payload.lineItems || [];
    let periodTotal = new Decimal(0);

    items.forEach(item => {
      // Precision fix: Use Decimal.js for monetary calculations
      const qty = new Decimal(item.quantity || 0);
      const price = new Decimal(item.unitPrice || 0);
      const itemTotal = qty.times(price);
      periodTotal = periodTotal.plus(itemTotal);

      const category = item.itemCategory || 'Uncategorized';
      const currentCategoryTotal = new Decimal(aggregated[period].categoryTotals[category] || 0);
      aggregated[period].categoryTotals[category] = currentCategoryTotal.plus(itemTotal).toNumber();
    });

    aggregated[period].amount += periodTotal.toNumber();
    aggregated[period].requestCount += 1;
  });

  return Object.values(aggregated).sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Handle prediction for new department with no history
 * @param {number} departmentId - Department ID
 * @param {number} targetYear - Target year
 * @param {number} targetMonth - Target month
 * @returns {Promise<Object>} Budget prediction record
 */
async function handleNewDepartment(departmentId, targetYear, targetMonth) {
  return await prisma.budgetPrediction.create({
    data: {
      departmentId,
      targetYear,
      targetMonth,
      predictedAmount: DEFAULT_NEW_DEPARTMENT_BUDGET,
      confidence: 'low',
      algorithm: 'default',
      aiInsights: 'No historical data available',
      triggerType: 'manual'
    }
  });
}

/**
 * Call analytics agent to generate prediction
 * @param {Object} department - Department object
 * @param {Array} historicalData - Historical spending data
 * @param {number} targetYear - Target year
 * @param {number} targetMonth - Target month
 * @returns {Promise<Object>} AI prediction response
 */
async function callAnalyticsAgent(department, historicalData, targetYear, targetMonth) {
  const message = `Predict budget for ${department.name} (${department.code}) for ${targetYear}-${String(targetMonth).padStart(2, '0')}. Historical data points: ${historicalData.length}`;

  // Calculate baseline statistics
  const amounts = historicalData.map(d => d.amount);
  const avgAmount = amounts.length > 0
    ? amounts.reduce((a, b) => a + b, 0) / amounts.length
    : DEFAULT_FALLBACK_BUDGET;

  // Determine confidence based on data quantity
  const confidence =
    amounts.length >= CONFIDENCE_THRESHOLD_HIGH ? 'high' :
    amounts.length >= CONFIDENCE_THRESHOLD_MEDIUM ? 'medium' :
    'low';

  try {
    const response = await analyticsAgent.chat(message);

    // TODO: Parse AI response to extract structured prediction details
    // For now, use statistical baseline with AI insights text
    return {
      amount: avgAmount,
      confidence,
      insights: response.response || 'Prediction based on historical spending patterns',
      // TODO: Implement category breakdown parsing from AI response
      categoryBreakdown: {},
      // TODO: Implement comparison data parsing from AI response
      comparisonData: {}
    };
  } catch (error) {
    // Fallback if AI agent fails - use statistical baseline
    return {
      amount: avgAmount,
      confidence,
      insights: 'Prediction based on historical average (AI agent unavailable)',
      categoryBreakdown: {},
      comparisonData: {}
    };
  }
}

/**
 * Generate budget prediction for a department
 * @param {string} deptCode - Department code or name
 * @param {number} targetYear - Target year for prediction
 * @param {number} targetMonth - Target month for prediction (1-12)
 * @param {number|null} userId - User ID if manually triggered, null for auto
 * @returns {Promise<Object>} Budget prediction record
 */
export async function generateDepartmentPrediction(deptCode, targetYear, targetMonth, userId) {
  // Find department by code or name (case-insensitive)
  const department = await prisma.department.findFirst({
    where: {
      OR: [
        { code: { equals: deptCode, mode: 'insensitive' } },
        { name: { equals: deptCode, mode: 'insensitive' } }
      ]
    }
  });

  if (!department) {
    throw new Error(`Department not found: ${deptCode}`);
  }

  // Get historical spending data
  const historicalData = await getHistoricalSpending(department.id);

  // Handle new department with no history
  if (historicalData.length === 0) {
    return handleNewDepartment(department.id, targetYear, targetMonth);
  }

  // Call analytics agent for prediction
  const aiResponse = await callAnalyticsAgent(department, historicalData, targetYear, targetMonth);

  // Create prediction record
  const prediction = await prisma.budgetPrediction.create({
    data: {
      departmentId: department.id,
      targetYear,
      targetMonth,
      predictedAmount: aiResponse.amount,
      confidence: aiResponse.confidence,
      algorithm: 'holt_winters',
      aiInsights: aiResponse.insights,
      categoryBreakdown: aiResponse.categoryBreakdown,
      comparisonData: aiResponse.comparisonData,
      triggerType: userId ? 'manual' : 'auto'
    }
  });

  return prediction;
}

export { getHistoricalSpending };
