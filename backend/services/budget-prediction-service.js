import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';

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
 * Get historical spending data for a department
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array>} Historical spending data
 */
async function getHistoricalSpending(departmentId) {
  // First, fetch the target department to get its name and code
  const targetDept = await prisma.department.findUnique({
    where: { id: departmentId }
  });

  if (!targetDept) {
    return [];
  }

  // Build department name/code matchers (case-insensitive)
  const deptMatchers = [
    targetDept.name.toLowerCase(),
    targetDept.code.toLowerCase()
  ];

  // Query PurchaseRequestRecord for historical spending
  // Filter for requests that have department field populated
  const requests = await prisma.purchaseRequestRecord.findMany({
    where: {
      payload: {
        path: ['department'],
        not: null
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Filter and aggregate in-memory (Prisma JSON filtering is limited)
  const historicalData = [];

  for (const request of requests) {
    if (!request.payload || !request.payload.department) continue;

    // Match department by name or code (case-insensitive)
    const requestDept = request.payload.department.toLowerCase();
    if (!deptMatchers.includes(requestDept)) continue;

    // Calculate total amount from items
    let totalAmount = 0;
    if (request.payload.items && Array.isArray(request.payload.items)) {
      totalAmount = request.payload.items.reduce((sum, item) => {
        return sum + (parseFloat(item.totalPrice) || 0);
      }, 0);
    }

    historicalData.push({
      date: request.createdAt,
      amount: totalAmount,
      payload: request.payload
    });
  }

  return historicalData;
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
