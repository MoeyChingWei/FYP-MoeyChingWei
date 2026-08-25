import prisma from '../config/prisma.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';
import Decimal from 'decimal.js';
import { notifyBudgetPredictionReady } from './notification-service.js';
import crypto from 'crypto';

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

async function savePredictionForPeriod(departmentId, targetYear, targetMonth, data) {
  const existingPrediction = await prisma.budgetPrediction.findFirst({
    where: { departmentId, targetYear, targetMonth },
    orderBy: { createdAt: 'desc' }
  });

  if (existingPrediction) {
    return prisma.budgetPrediction.update({
      where: { id: existingPrediction.id },
      data
    });
  }

  return prisma.budgetPrediction.create({
    data: { departmentId, targetYear, targetMonth, ...data }
  });
}

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
    // Use the PR's actual creation date from payload if available, otherwise use record timestamp
    const dateStr = request.payload?.createdAt || request.createdAt;
    const date = new Date(dateStr);
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
    prediction = await savePredictionForPeriod(departmentId, targetYear, targetMonth, {
      predictedAmount: DEFAULT_NEW_DEPARTMENT_BUDGET,
      confidence: 'low',
      algorithm: 'default',
      aiInsights: 'No historical data available and no similar departments found. Using system default.',
      triggerType: userId ? 'manual' : 'automatic',
      triggeredBy: userId || null
    });
  } else {
    const topSimilar = similarDepts[0];
    const avgAmount = Math.round(topSimilar.avgSpending * 100) / 100;

    const insight = `New department with no historical data. Prediction based on similar department "${topSimilar.name}" (${Math.round(topSimilar.similarity * 100)}% similarity, ${topSimilar.historicalMonths} months of data). Consider adjusting based on department size and objectives.`;

    prediction = await savePredictionForPeriod(departmentId, targetYear, targetMonth, {
      predictedAmount: avgAmount,
      confidence: 'low',
      algorithm: 'similar_department',
      aiInsights: insight,
      comparisonData: {
        similarDepartment: topSimilar.name,
        similarity: topSimilar.similarity,
        referenceMonths: topSimilar.historicalMonths
      },
      triggerType: userId ? 'manual' : 'automatic',
      triggeredBy: userId || null
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
  const content = String(response ?? '').trim();
  const jsonCandidates = [content];

  const fencedJson = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) jsonCandidates.push(fencedJson[1].trim());

  const objectJson = content.match(/\{[\s\S]*\}/);
  if (objectJson?.[0]) jsonCandidates.push(objectJson[0]);

  for (const candidate of jsonCandidates) {
    try {
      const parsed = JSON.parse(candidate);
      const predictedAmount = Number(parsed.predictedAmount ?? parsed.amount);
      if (Number.isFinite(predictedAmount) && predictedAmount >= 0) {
        return {
          predictedAmount,
          confidence: ['very_high', 'low', 'medium', 'high'].includes(parsed.confidence)
            ? parsed.confidence
            : 'low',
          insights: String(parsed.insights || 'AI Agent generated this forecast from the available purchasing history.'),
          categoryBreakdown: parsed.categoryBreakdown && typeof parsed.categoryBreakdown === 'object'
            ? parsed.categoryBreakdown
            : {},
          predictionInterval: parsed.predictionInterval ?? parsed.interval,
          modelBreakdown: parsed.modelBreakdown,
          method: parsed.method
        };
      }
    } catch {
      // Try the next response format before using the fallback forecast.
    }
  }

  // Some models follow the analysis request but omit the JSON wrapper. Preserve
  // a clearly labelled amount instead of silently discarding the AI result.
  const amountMatch = content.match(/(?:predicted(?:\s+(?:amount|spending|budget))?|forecast(?:ed)?(?:\s+(?:amount|spending|budget))?)\s*(?:is|:|of|for)?\s*(?:MYR|RM|\$)?\s*([\d,]+(?:\.\d{1,2})?)(?![-\d])/i);
  if (amountMatch) {
    const predictedAmount = Number(amountMatch[1].replace(/,/g, ''));
    if (Number.isFinite(predictedAmount) && predictedAmount >= 0) {
      return {
        predictedAmount,
        confidence: /\bhigh confidence\b/i.test(content) ? 'high' : /\bmedium confidence\b/i.test(content) ? 'medium' : 'low',
        insights: content,
        categoryBreakdown: {}
      };
    }
  }

  throw new Error(`AI response did not include a valid predicted amount: ${content.slice(0, 240)}`);
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
async function callAnalyticsAgent(department, historicalData, targetYear, targetMonth, requestedBy) {
  const requestId = crypto.randomUUID();
  const lastPeriod = historicalData[historicalData.length - 1];
  const avgAmount = historicalData
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .dividedBy(historicalData.length)
    .toDecimalPlaces(2);

  const prompt = `Predict the budget spending for department "${department.name}" for period ${targetYear}-${String(targetMonth).padStart(2, '0')}.

Use the predict_future_spending tool with the following parameters:
- department: "${department.name}"
- forecastMonths: 1
- includeSeasonality: ${historicalData.length >= 12}

The system has ${historicalData.length} months of historical data available.

After getting the prediction, format the response as JSON with these fields:
{
  "predictedAmount": <number from ensemble forecast>,
  "confidence": "<confidence level>",
  "insights": "<explanation including model used and confidence reasoning>",
  "categoryBreakdown": <estimate based on historical category distribution>,
  "predictionInterval": <interval data if available>,
  "modelBreakdown": <individual model predictions if available>,
  "method": "<forecast method used>"
}`;

  try {
    const analysisUser = requestedBy
      ? { id: requestedBy }
      : await prisma.user.findFirst({
          where: { isActive: true },
          select: { id: true }
        });

    if (!analysisUser) {
      throw new Error('No active user is available to run the AI analysis');
    }

    const aiResponse = await analyticsAgent.chat({
      userId: analysisUser.id,
      message: prompt,
      sessionId: `budget-prediction-${department.id}-${Date.now()}`,
      systemPromptAddition: '',
      // BaseAgent requires complete tool definitions, not just tool names.
      availableTools: analyticsAgent.tools.filter(tool => tool.name === 'predict_future_spending'),
      maxTokens: 2048,
      temperature: 0.3,
      persistHistory: false,
    });

    if (!aiResponse.success) {
      throw new Error('AI agent returned unsuccessful response');
    }

    // Parse the AI response
    const parsed = parseAIResponse(aiResponse.content);

    return {
      amount: parsed.predictedAmount,
      confidence: parsed.confidence || 'medium',
      insights: parsed.insights,
      categoryBreakdown: parsed.categoryBreakdown,
      predictionInterval: parsed.predictionInterval, // New: upper/lower bounds
      modelBreakdown: parsed.modelBreakdown, // New: individual model predictions
      method: parsed.method, // New: which ensemble method was used
      comparisonData: {
        lastMonthAmount: lastPeriod.amount,
        avgAmount: avgAmount.toNumber(),
        trend: new Decimal(lastPeriod.amount).greaterThan(avgAmount) ? 'increasing' : 'decreasing',
        historicalPeriods: historicalData.length
      },
      usedFallback: false
    };
  } catch (error) {
    console.error('[BudgetPrediction]', {
      operation: 'callAnalyticsAgent',
      requestId,
      departmentId: department.id,
      departmentName: department.name,
      targetYear,
      targetMonth,
      timestamp: new Date().toISOString(),
      model: 'analytics-agent',
      promptLength: prompt.length,
      error: error.message,
      stack: error.stack,
      fallbackMethod: 'moving_average'
    });

    const fallback = fallbackPrediction(historicalData);
    return {
      ...fallback,
      usedFallback: true
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
    return handleNewDepartment(department.id, targetYear, targetMonth, userId);
  }

  // Call analytics agent for prediction
  const aiResponse = await callAnalyticsAgent(department, historicalData, targetYear, targetMonth, userId);

  // Create prediction record with enhanced analytics data
  const prediction = await savePredictionForPeriod(department.id, targetYear, targetMonth, {
    predictedAmount: aiResponse.amount,
    confidence: aiResponse.confidence,
    algorithm: aiResponse.method || (aiResponse.usedFallback ? 'moving_average_fallback' : 'ensemble'),
    aiInsights: aiResponse.insights,
    categoryBreakdown: aiResponse.categoryBreakdown,
    comparisonData: {
      ...aiResponse.comparisonData,
      usedFallback: aiResponse.usedFallback || false,
      predictionInterval: aiResponse.predictionInterval,
      modelBreakdown: aiResponse.modelBreakdown
    },
    triggerType: userId ? 'manual' : 'automatic',
    triggeredBy: userId || null
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
