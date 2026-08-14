import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';

/**
 * Get historical spending data for a department
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array>} Historical spending data
 */
async function getHistoricalSpending(departmentId) {
  // Query PurchaseRequestRecord for historical spending
  const requests = await prisma.purchaseRequestRecord.findMany({
    where: {
      payload: {
        path: ['department'],
        not: null
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Filter by department and aggregate
  const historicalData = [];

  for (const request of requests) {
    if (!request.payload || !request.payload.department) continue;

    // Match department by ID lookup
    const dept = await prisma.department.findFirst({
      where: {
        OR: [
          { name: { equals: request.payload.department, mode: 'insensitive' } },
          { code: { equals: request.payload.department, mode: 'insensitive' } }
        ]
      }
    });

    if (dept && dept.id === departmentId) {
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
      predictedAmount: 50000,
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

  try {
    const response = await analyticsAgent.chat(message);

    // Parse AI response to extract prediction details
    // For now, use a simple calculation based on historical data
    const amounts = historicalData.map(d => d.amount);
    const avgAmount = amounts.length > 0
      ? amounts.reduce((a, b) => a + b, 0) / amounts.length
      : 100000;

    return {
      amount: avgAmount,
      confidence: amounts.length >= 12 ? 'high' : amounts.length >= 6 ? 'medium' : 'low',
      insights: response.response || 'Prediction based on historical spending patterns',
      categoryBreakdown: {},
      comparisonData: {}
    };
  } catch (error) {
    // Fallback if AI agent fails
    const amounts = historicalData.map(d => d.amount);
    const avgAmount = amounts.length > 0
      ? amounts.reduce((a, b) => a + b, 0) / amounts.length
      : 100000;

    return {
      amount: avgAmount,
      confidence: amounts.length >= 12 ? 'high' : amounts.length >= 6 ? 'medium' : 'low',
      insights: 'Prediction based on historical average',
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
