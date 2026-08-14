import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';
import Decimal from 'decimal.js';
import { notifyBudgetPredictionReady } from './notification-service.js';

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
 * Calculate name similarity between two department names
 * @param {string} name1 - First department name
 * @param {string} name2 - Second department name
 * @returns {number} Similarity score (0-1)
 */
function calculateNameSimilarity(name1, name2) {
  const words1 = name1.toLowerCase().split(/\s+/);
  const words2 = name2.toLowerCase().split(/\s+/);

  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.includes(word2) || word2.includes(word1)) {
        matches++;
        break;
      }
    }
  }

  return matches / Math.max(words1.length, words2.length);
}

/**
 * Find similar departments based on name matching
 * @param {number} departmentId - Target department ID
 * @returns {Promise<Array>} Array of similar departments with similarity scores
 */
async function findSimilarDepartments(departmentId) {
  const targetDept = await prisma.department.findUnique({
    where: { id: departmentId }
  });

  const allDepts = await prisma.department.findMany({
    where: {
      id: { not: departmentId },
      isActive: true
    }
  });

  const similarDepts = [];

  for (const dept of allDepts) {
    const history = await getHistoricalSpending(dept.id);
    if (history.length === 0) continue;

    const nameSimilarity = calculateNameSimilarity(targetDept.name, dept.name);

    if (nameSimilarity > 0.3) {
      const avgSpending = history
        .reduce((sum, h) => sum.plus(new Decimal(h.amount)), new Decimal(0))
        .dividedBy(history.length);

      similarDepts.push({
        id: dept.id,
        name: dept.name,
        similarity: nameSimilarity,
        avgSpending: avgSpending.toNumber(),
        historicalMonths: history.length
      });
    }
  }

  return similarDepts.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Handle prediction for new department with no history
 * @param {number} departmentId - Department ID
 * @param {number} targetYear - Target year
 * @param {number} targetMonth - Target month
 * @param {number|null} userId - User ID if manually triggered, null for auto
 * @returns {Promise<Object>} Budget prediction record
 */
async function handleNewDepartment(departmentId, targetYear, targetMonth, userId) {
  const similarDepts = await findSimilarDepartments(departmentId);

  let prediction;
  if (similarDepts.length === 0) {
    prediction = await prisma.budgetPrediction.create({
      data: {
        departmentId,
        targetYear,
        targetMonth,
        predictedAmount: DEFAULT_NEW_DEPARTMENT_BUDGET,
        confidence: 'low',
        algorithm: 'default',
        aiInsights: 'No historical data available and no similar departments found. Using system default.',
        triggerType: userId ? 'manual' : 'auto'
      }
    });
  } else {
    const topSimilar = similarDepts[0];
    const avgAmount = Math.round(topSimilar.avgSpending * 100) / 100;

    const insight = `New department with no historical data. Prediction based on similar department "${topSimilar.name}" (${Math.round(topSimilar.similarity * 100)}% similarity, ${topSimilar.historicalMonths} months of data). Consider adjusting based on department size and objectives.`;

    prediction = await prisma.budgetPrediction.create({
      data: {
        departmentId,
        targetYear,
        targetMonth,
        predictedAmount: avgAmount,
        confidence: 'low',
        algorithm: 'similar_department',
        aiInsights: insight,
        comparisonData: {
          similarDepartment: topSimilar.name,
          similarity: topSimilar.similarity,
          referenceMonths: topSimilar.historicalMonths
        },
        triggerType: userId ? 'manual' : 'auto'
      }
    });
  }

  // Send notification if manually triggered
  if (userId) {
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });
    await notifyBudgetPredictionReady(
      userId,
      department.name,
      targetYear,
      targetMonth,
      prediction.predictedAmount,
      prediction.id
    );
  }

  return prediction;
}

/**
 * Parse AI response to extract JSON
 * @param {string} response - AI response text
 * @returns {Object} Parsed prediction data
 */
function parseAIResponse(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
}

/**
 * Fallback prediction using moving average
 * @param {Array} historicalData - Historical spending data
 * @returns {Object} Fallback prediction result
 */
function fallbackPrediction(historicalData) {
  const recent = historicalData.slice(-3);
  const avgAmount = recent
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .dividedBy(recent.length)
    .toDecimalPlaces(2);

  return {
    amount: avgAmount.toNumber(),
    confidence: 'low',
    insights: 'Fallback prediction using 3-month moving average due to AI error.',
    categoryBreakdown: {},
    comparisonData: {
      lastMonthAmount: historicalData[historicalData.length - 1].amount,
      avgAmount: avgAmount.toNumber(),
      trend: 'stable',
      historicalPeriods: historicalData.length
    }
  };
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
  const lastPeriod = historicalData[historicalData.length - 1];
  const avgAmount = historicalData
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .dividedBy(historicalData.length)
    .toDecimalPlaces(2);

  const prompt = `You are a budget forecasting AI using Holt-Winters Triple Exponential Smoothing.

Department: ${department.name}
Target Period: ${targetYear}-${String(targetMonth).padStart(2, '0')}

Historical Spending (Last ${historicalData.length} months):
${historicalData.map(h => `- ${h.period}: $${h.amount.toFixed(2)} (${h.requestCount} requests)`).join('\n')}

Category Breakdown (Latest Period ${lastPeriod.period}):
${Object.entries(lastPeriod.categoryTotals).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Please predict next month's budget using Holt-Winters algorithm and provide:
1. Predicted amount (number only)
2. Confidence level (low/medium/high)
3. Key insights (2-3 sentences)
4. Category breakdown forecast (JSON object)

Format your response as JSON:
{
  "predictedAmount": <number>,
  "confidence": "<low|medium|high>",
  "insights": "<string>",
  "categoryBreakdown": {<category>: <amount>, ...}
}`;

  try {
    const aiResponse = await analyticsAgent.chat({
      userId: 1,
      message: prompt,
      sessionId: `budget-prediction-${department.id}-${Date.now()}`
    });

    if (!aiResponse.success) {
      throw new Error('AI agent returned unsuccessful response');
    }

    const parsed = parseAIResponse(aiResponse.content);

    return {
      amount: parsed.predictedAmount,
      confidence: parsed.confidence,
      insights: parsed.insights,
      categoryBreakdown: parsed.categoryBreakdown,
      comparisonData: {
        lastMonthAmount: lastPeriod.amount,
        avgAmount: avgAmount.toNumber(),
        trend: new Decimal(lastPeriod.amount).greaterThan(avgAmount) ? 'increasing' : 'decreasing',
        historicalPeriods: historicalData.length
      }
    };
  } catch (error) {
    console.error('AI prediction failed:', error);
    return fallbackPrediction(historicalData);
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
    return handleNewDepartment(department.id, targetYear, targetMonth, userId);
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

  // Send notification if manually triggered
  if (userId) {
    await notifyBudgetPredictionReady(
      userId,
      department.name,
      targetYear,
      targetMonth,
      prediction.predictedAmount,
      prediction.id
    );
  }

  return prediction;
}

/**
 * Generate predictions for all active departments
 * @param {number} targetYear - Target year for prediction
 * @param {number} targetMonth - Target month for prediction (1-12)
 * @param {number|null} userId - User ID if manually triggered, null for auto
 * @returns {Promise<Object>} Results object with success and failed arrays
 */
export async function generatePredictionsForAllDepartments(targetYear, targetMonth, userId) {
  const departments = await prisma.department.findMany({
    where: { isActive: true }
  });

  const results = await Promise.allSettled(
    departments.map(dept =>
      generateDepartmentPrediction(dept.code, targetYear, targetMonth, userId)
        .then(prediction => ({ dept, prediction }))
        .catch(error => {
          error.dept = dept;
          throw error;
        })
    )
  );

  return {
    success: results
      .filter(r => r.status === 'fulfilled')
      .map(r => ({
        departmentId: r.value.dept.id,
        departmentCode: r.value.dept.code,
        predictionId: r.value.prediction.id
      })),
    failed: results
      .filter(r => r.status === 'rejected')
      .map(r => ({
        departmentId: r.reason.dept?.id,
        departmentCode: r.reason.dept?.code,
        error: r.reason.message
      }))
  };
}

export { getHistoricalSpending, callAnalyticsAgent, handleNewDepartment, findSimilarDepartments };
