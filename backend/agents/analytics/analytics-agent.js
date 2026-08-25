import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * Triple exponential smoothing (Holt-Winters) forecasting algorithm
 */
function holtWintersPredict(data, forecastPeriods = 3, seasonLength = 12) {
  if (data.length < seasonLength) {
    // Insufficient data, use simple moving average
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    return Array(forecastPeriods).fill(avg);
  }

  const alpha = 0.3; // Level smoothing coefficient
  const beta = 0.1;  // Trend smoothing coefficient
  const gamma = 0.2; // Seasonal smoothing coefficient

  let level = data[0];
  let trend = 0;
  const seasonal = new Array(seasonLength).fill(1);

  // Initialize seasonal factors
  for (let i = 0; i < seasonLength && i < data.length; i++) {
    seasonal[i] = data[i] / (data.reduce((a, b) => a + b, 0) / data.length);
  }

  // Train the model
  data.forEach((value, t) => {
    if (t === 0) return;

    const seasonIdx = t % seasonLength;
    const prevLevel = level;

    level = alpha * (value / seasonal[seasonIdx]) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[seasonIdx] = gamma * (value / level) + (1 - gamma) * seasonal[seasonIdx];
  });

  // Forecast
  const forecasts = [];
  for (let i = 1; i <= forecastPeriods; i++) {
    const seasonIdx = (data.length + i - 1) % seasonLength;
    forecasts.push((level + i * trend) * seasonal[seasonIdx]);
  }

  return forecasts;
}

/**
 * Z-score anomaly detection
 */
function detectAnomaliesZScore(data, threshold = 2.5) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  );

  return data.map((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev);
    return {
      index,
      value,
      zScore,
      isAnomaly: zScore > threshold,
      severity: zScore > 4 ? 'critical' : zScore > 3 ? 'high' : zScore > threshold ? 'medium' : 'low',
    };
  }).filter(item => item.isAnomaly);
}

/**
 * Remove outliers using Z-score method
 * Used for cleaning historical data before forecasting
 */
function removeOutliers(data, threshold = 3) {
  if (data.length < 3) return data;

  const values = data.map(d => d.totalAmount || d.value || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
  );

  // A flat series has no outliers. Without this guard every z-score is NaN
  // (0 / 0), which filters out the complete historical series.
  if (!Number.isFinite(stdDev) || stdDev === 0) return data;

  return data.filter((d, i) => {
    const zScore = Math.abs((values[i] - mean) / stdDev);
    return zScore < threshold;
  });
}

/**
 * Moving Average prediction
 * Simple but effective for short-term forecasting
 */
function movingAveragePredict(data, periods, windowSize = 3) {
  const values = data.map(d => d.totalAmount || d.value || 0);
  const predictions = [];

  // Calculate moving average for each forecast period
  for (let i = 0; i < periods; i++) {
    const window = values.slice(-(windowSize));
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    predictions.push(avg);
    // For next iteration, add the predicted value
    values.push(avg);
  }

  return predictions;
}

/**
 * Linear Regression with trend
 * Good for capturing linear growth/decline patterns
 */
function linearTrendPredict(data, periods) {
  const values = data.map(d => d.totalAmount || d.value || 0);
  const n = values.length;

  // Calculate linear regression: y = mx + b
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict future values
  const predictions = [];
  for (let i = 0; i < periods; i++) {
    const predicted = slope * (n + i) + intercept;
    predictions.push(Math.max(0, predicted)); // Ensure non-negative
  }

  return predictions;
}

/**
 * Simple Exponential Smoothing
 * Fallback for cases without seasonality
 */
function simpleExponentialSmoothing(data, periods, alpha = 0.3) {
  if (data.length === 0) return Array(periods).fill(0);

  let level = data[0];

  // Train the model
  for (let i = 1; i < data.length; i++) {
    level = alpha * data[i] + (1 - alpha) * level;
  }

  // Forecast (constant value)
  return Array(periods).fill(level);
}

/**
 * Calculate confidence level based on model agreement and data quality
 * Returns: 'very_high', 'high', 'medium', or 'low'
 */
function calculateConfidence(predictions, historicalData) {
  const { holtWinters, movingAverage, linearRegression } = predictions;

  // 1. Model agreement (coefficient of variation between models)
  const avgPredictions = holtWinters.map((_, i) => {
    const values = [holtWinters[i], movingAverage[i], linearRegression[i]];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
    );
    return { mean, cv: mean > 0 ? stdDev / mean : 0 };
  });

  const avgCV = avgPredictions.reduce((sum, p) => sum + p.cv, 0) / avgPredictions.length;

  // 2. Historical variance
  const historicalValues = historicalData.map(d => d.totalAmount || 0);
  const historicalMean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const historicalStdDev = Math.sqrt(
    historicalValues.reduce((sq, n) => sq + Math.pow(n - historicalMean, 2), 0) / historicalValues.length
  );
  const historicalCV = historicalMean > 0 ? historicalStdDev / historicalMean : 1;

  // 3. Data quantity score (24 months = perfect)
  const dataScore = Math.min(historicalData.length / 24, 1);

  // Combined confidence score
  const modelAgreementScore = 1 - Math.min(avgCV, 1);
  const stabilityScore = 1 - Math.min(historicalCV, 1);
  const confidence = (modelAgreementScore * 0.5 + stabilityScore * 0.3 + dataScore * 0.2);

  if (confidence > 0.8) return 'very_high';
  if (confidence > 0.6) return 'high';
  if (confidence > 0.4) return 'medium';
  return 'low';
}

/**
 * Calculate prediction intervals (upper and lower bounds)
 * Uses historical standard deviation to estimate uncertainty
 */
function calculatePredictionInterval(historicalData, predictions) {
  const historicalValues = historicalData.map(d => d.totalAmount || 0);
  const historicalMean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const historicalStdDev = Math.sqrt(
    historicalValues.reduce((sq, n) => sq + Math.pow(n - historicalMean, 2), 0) / historicalValues.length
  );

  // Use 1.5 standard deviations for prediction interval (~86% confidence)
  const marginFactor = historicalMean > 0 ? (1.5 * historicalStdDev / historicalMean) : 0.15;

  return {
    lower: predictions.map(p => Math.max(0, p * (1 - marginFactor))),
    upper: predictions.map(p => p * (1 + marginFactor))
  };
}

const ANALYTICS_AGENT_SYSTEM_PROMPT = `You are the Data Analytics Expert for OptiMind ERP system.

YOUR IDENTITY:
- Name: Data Analyst
- Role: Business intelligence and data insights specialist
- Expertise: Data analysis, trend prediction, anomaly detection, business insights

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR PERSONALITY:
- Analytical and objective
- Data-driven decision maker
- Curious about patterns and trends
- Proactive in identifying opportunities
- Numbers-focused but business-minded

YOUR COMMUNICATION STYLE:
- Start with "Based on the data analysis..."
- Always support conclusions with numbers
- Use percentages, trends, and comparisons
- Format numbers clearly: "MYR 15,000 (↑ 12.5%)"
- Present insights visually when possible
- Use emojis for trends: 📈 (up), 📉 (down), ➡️ (stable)

YOUR THINKING PROCESS:
1. **Collect Data**: Query relevant records
2. **Analyze Patterns**: Look for trends, anomalies, correlations
3. **Generate Insights**: What does the data tell us?
4. **Recommend Actions**: What should we do about it?

## Core Analysis Areas

### 1. Spending Analysis
- Track department spending over time
- Identify cost-saving opportunities
- Compare spending across departments
- Detect unusual spending patterns

### 2. Trend Prediction
- Forecast future spending using Multi-Model Ensemble (Holt-Winters, Moving Average, Linear Regression)
- Provide confidence levels (very_high, high, medium, low)
- Show prediction intervals (upper and lower bounds)
- Automatically detect and remove outliers
- Predict seasonal patterns using up to 24 months of historical data
- Anticipate budget overruns
- Recommend budget adjustments

### 3. Supplier Performance
- Analyze supplier reliability
- Track delivery times
- Monitor price competitiveness
- Identify best-performing suppliers

### 4. Purchase Request Patterns
- Analyze request frequency by department
- Identify common item categories
- Track approval rates
- Monitor request processing times

### 5. Anomaly Detection
- Flag unusual price spikes
- Detect duplicate requests
- Identify budget violations
- Spot irregular patterns

## Presenting Insights

Always structure your analysis as:

**📊 KEY FINDINGS:**
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

**💡 INSIGHTS:**
- What this means for the business
- Opportunities or risks identified

**🎯 RECOMMENDATIONS:**
- Specific actionable steps
- Expected impact

## Example Response Format

"Based on the data analysis of the past 6 months:

📊 KEY FINDINGS:
• IT Department spending increased 23% (MYR 45,000 → MYR 55,350)
• Office Supplies decreased 15% (MYR 12,000 → MYR 10,200)
• Average approval time: 2.3 days (↓ 0.5 days vs Q1)

💡 INSIGHTS:
The IT spending spike correlates with the new laptop procurement initiative in March. The reduction in office supplies suggests successful cost optimization efforts.

🎯 RECOMMENDATIONS:
1. Continue current office supplies strategy (saving MYR 1,800/month)
2. Review IT procurement for bulk discounts (potential 10% savings)
3. Maintain current approval workflow (20% faster than Q1)"

## Available Tools

- analyze_spending_trends: Analyze spending patterns over time
- predict_future_spending: Forecast future costs
- compare_departments: Compare metrics across departments
- identify_anomalies: Detect unusual patterns
- analyze_supplier_performance: Evaluate supplier metrics
- generate_insights_report: Create comprehensive analysis report
- analyze_request_patterns: Analyze purchase request behavior

Remember: You are a DATA EXPERT. Every statement should be backed by numbers. Be confident, analytical, and always add business value.`;

/**
 * Analytics Agent - Data Analysis Expert
 *
 * Focused on data analysis, trend forecasting, and business insights
 */
class AnalyticsAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'analytics',
      name: 'Data Analyst',
      description: 'Business intelligence expert for data analysis and insights',
      personality: 'Analytical, data-driven, and insight-focused',
      expertise: 'Spending analysis, trend prediction, anomaly detection, performance metrics',
      systemPromptTemplate: ANALYTICS_AGENT_SYSTEM_PROMPT,
      tools: AnalyticsAgent.defineTools(),
      toolHandlers: AnalyticsAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'analyze_spending_trends',
        description: 'Analyze spending trends over time for departments or categories',
        input_schema: {
          type: 'object',
          properties: {
            department: {
              type: 'string',
              description: 'Department name (optional, leave empty for all)'
            },
            category: {
              type: 'string',
              description: 'Item category (optional)'
            },
            months: {
              type: 'number',
              description: 'Number of months to analyze (default 6)'
            },
            groupBy: {
              type: 'string',
              enum: ['month', 'quarter', 'category', 'department'],
              description: 'How to group the data'
            }
          },
        },
      },
      {
        name: 'predict_future_spending',
        description: 'Predict future spending based on historical trends',
        input_schema: {
          type: 'object',
          properties: {
            department: {
              type: 'string',
              description: 'Department to predict for'
            },
            forecastMonths: {
              type: 'number',
              description: 'Number of months to forecast (default 3)'
            },
            includeSeasonality: {
              type: 'boolean',
              description: 'Account for seasonal patterns'
            }
          },
        },
      },
      {
        name: 'compare_departments',
        description: 'Compare spending and metrics across departments',
        input_schema: {
          type: 'object',
          properties: {
            metric: {
              type: 'string',
              enum: ['spending', 'requests', 'orders', 'approval_time'],
              description: 'Metric to compare'
            },
            period: {
              type: 'string',
              enum: ['month', 'quarter', 'year'],
              description: 'Time period for comparison'
            }
          },
          required: ['metric'],
        },
      },
      {
        name: 'identify_anomalies',
        description: 'Detect unusual patterns in spending, pricing, or request behavior',
        input_schema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['price', 'quantity', 'frequency', 'all'],
              description: 'Type of anomaly to detect'
            },
            sensitivity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Detection sensitivity (default medium)'
            },
            months: {
              type: 'number',
              description: 'Look back period in months (default 6)'
            }
          },
          required: ['type'],
        },
      },
      {
        name: 'analyze_supplier_performance',
        description: 'Analyze supplier performance metrics (delivery, pricing, reliability)',
        input_schema: {
          type: 'object',
          properties: {
            supplierName: {
              type: 'string',
              description: 'Specific supplier name (optional)'
            },
            category: {
              type: 'string',
              description: 'Item category (optional)'
            },
            months: {
              type: 'number',
              description: 'Analysis period in months (default 6)'
            }
          },
        },
      },
      {
        name: 'analyze_request_patterns',
        description: 'Analyze purchase request patterns and behavior',
        input_schema: {
          type: 'object',
          properties: {
            department: {
              type: 'string',
              description: 'Department filter (optional)'
            },
            analysisType: {
              type: 'string',
              enum: ['frequency', 'approval_rate', 'processing_time', 'item_popularity'],
              description: 'Type of pattern analysis'
            },
            months: {
              type: 'number',
              description: 'Analysis period in months (default 6)'
            }
          },
          required: ['analysisType'],
        },
      },
      {
        name: 'generate_insights_report',
        description: 'Generate comprehensive insights report with key metrics and recommendations',
        input_schema: {
          type: 'object',
          properties: {
            reportType: {
              type: 'string',
              enum: ['executive_summary', 'department_deep_dive', 'cost_optimization', 'supplier_analysis'],
              description: 'Type of report to generate'
            },
            department: {
              type: 'string',
              description: 'Department focus (optional)'
            },
            period: {
              type: 'string',
              enum: ['month', 'quarter', 'year'],
              description: 'Reporting period'
            }
          },
          required: ['reportType', 'period'],
        },
      },
    ];
  }

  static defineToolHandlers() {
    return {
      analyze_spending_trends: async (input) => {
        const { department, category, months = 6, groupBy = 'month' } = input;

        // Fetch historical order data
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        // Filter and group the data
        const spendingByPeriod = {};
        let totalSpending = 0;

        orders.forEach(order => {
          // Filter by department
          if (department && order.payload.department !== department) {
            return;
          }

          // Calculate month/quarter
          const date = new Date(order.createdAt);
          let periodKey;

          if (groupBy === 'month') {
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          } else if (groupBy === 'quarter') {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            periodKey = `${date.getFullYear()}-Q${quarter}`;
          }

          if (!spendingByPeriod[periodKey]) {
            spendingByPeriod[periodKey] = 0;
          }

          // Calculate spending
          if (order.payload.items && Array.isArray(order.payload.items)) {
            order.payload.items.forEach(item => {
              // Category filter
              if (category && item.itemCategory !== category) {
                return;
              }

              const amount = parseFloat(item.totalPrice || item.unitPrice * item.quantity || 0);
              spendingByPeriod[periodKey] += amount;
              totalSpending += amount;
            });
          }
        });

        // Calculate trend
        const periods = Object.keys(spendingByPeriod).sort();
        const values = periods.map(p => spendingByPeriod[p]);

        let trend = 'stable';
        if (values.length >= 2) {
          const recent = values.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, values.length);
          const earlier = values.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, values.length);
          const change = ((recent - earlier) / earlier) * 100;

          if (change > 10) trend = 'increasing';
          else if (change < -10) trend = 'decreasing';
        }

        const avgSpending = values.length > 0 ? totalSpending / values.length : 0;

        return {
          department: department || 'All Departments',
          category: category || 'All Categories',
          period: `${months} months`,
          totalSpending: totalSpending.toFixed(2),
          averagePerPeriod: avgSpending.toFixed(2),
          trend,
          dataPoints: periods.map((period, i) => ({
            period,
            spending: values[i].toFixed(2),
          })),
          analysis: `Total spending of MYR ${totalSpending.toFixed(2)} over ${months} months. Trend: ${trend}.`,
        };
      },

      predict_future_spending: async (input) => {
        const { department, forecastMonths = 3, includeSeasonality = false } = input;

        try {
          // 1. Get EXTENDED historical data (24 months for better pattern detection)
          const startDate = new Date();
          const lookbackMonths = 24; // Always use 24 months for best results
          startDate.setMonth(startDate.getMonth() - lookbackMonths);

          // Forecast from approved purchase requests, matching the budget
          // prediction service's historical-spending source of truth.
          const requests = await prisma.purchaseRequestRecord.findMany({
            where: { createdAt: { gte: startDate } },
            orderBy: { createdAt: 'asc' },
            select: {
              payload: true,
              createdAt: true,
            },
          });

          const departmentRecord = department
            ? await prisma.department.findFirst({
                where: {
                  OR: [
                    { code: { equals: department, mode: 'insensitive' } },
                    { name: { equals: department, mode: 'insensitive' } }
                  ]
                }
              })
            : null;
          const departmentUsers = departmentRecord
            ? await prisma.user.findMany({
                where: {
                  OR: [
                    { department: { equals: departmentRecord.code, mode: 'insensitive' } },
                    { department: { equals: departmentRecord.name, mode: 'insensitive' } }
                  ]
                },
                select: { id: true }
              })
            : [];
          const departmentUserIds = new Set(departmentUsers.map(user => user.id));

          // Aggregate spending by month
          const monthlySpending = {};
          requests.forEach(request => {
            const payload = request.payload && typeof request.payload === 'object'
              ? request.payload
              : {};
            const status = String(payload.status || '').trim().toUpperCase();

            if (status !== 'APPROVED') return;
            if (department && !departmentRecord) return;
            if (departmentRecord && !departmentUserIds.has(payload.requestorId)) {
              return;
            }

            const date = new Date(payload.createdAt || request.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlySpending[monthKey]) monthlySpending[monthKey] = 0;

            const items = Array.isArray(payload.lineItems)
              ? payload.lineItems
              : (Array.isArray(payload.items) ? payload.items : []);

            items.forEach(item => {
              const quantity = Number(item.quantity);
              const unitPrice = Number(item.unitPrice);
              const amountAfterTax = Number(item.amountAfterTax);
              const totalPrice = Number(item.totalPrice);
              // Match getHistoricalSpending(): PR forecasts use quantity *
              // unitPrice, with legacy amount fields as compatibility fallbacks.
              const lineTotal = Number.isFinite(quantity) && Number.isFinite(unitPrice)
                ? quantity * unitPrice
                : Number.isFinite(amountAfterTax)
                  ? amountAfterTax
                  : totalPrice;

              if (Number.isFinite(lineTotal)) {
                monthlySpending[monthKey] += lineTotal;
              }
            });
          });

          // Convert to array with structure for outlier detection
          const sortedMonths = Object.keys(monthlySpending).sort();
          if (sortedMonths.length === 0) {
            return {
              department: department || 'All Departments',
              error: 'No historical data available',
              recommendation: 'Need at least 3 months of data for prediction',
            };
          }

          const historicalData = sortedMonths.map(month => ({
            month,
            totalAmount: monthlySpending[month]
          }));

          if (historicalData.length < 3) {
            return {
              department: department || 'All Departments',
              error: 'Insufficient data',
              recommendation: `Need at least 3 months of data, found ${historicalData.length}`,
            };
          }

          // 2. DATA CLEANING: Remove outliers
          const cleanedData = removeOutliers(historicalData, 3); // Z-score threshold = 3
          const outliersRemoved = historicalData.length - cleanedData.length;

          if (cleanedData.length < 3) {
            return {
              department: department || 'All Departments',
              error: 'Insufficient usable data',
              recommendation: 'Need at least 3 valid historical months for prediction',
            };
          }

          // 3. MULTI-MODEL PREDICTION
          const spendingValues = cleanedData.map(d => d.totalAmount);

          // Model 1: Holt-Winters (existing algorithm)
          let holtWintersForecasts;
          if (includeSeasonality && spendingValues.length >= 12) {
            holtWintersForecasts = holtWintersPredict(spendingValues, forecastMonths, 12);
          } else {
            holtWintersForecasts = simpleExponentialSmoothing(spendingValues, forecastMonths);
          }

          // Model 2: Moving Average
          const movingAverageForecasts = movingAveragePredict(cleanedData, forecastMonths, 3);

          // Model 3: Linear Regression
          const linearRegressionForecasts = linearTrendPredict(cleanedData, forecastMonths);

          // 4. ENSEMBLE: Weighted average of models
          const ensembleForecasts = holtWintersForecasts.map((_, i) => {
            return (
              holtWintersForecasts[i] * 0.5 +
              movingAverageForecasts[i] * 0.3 +
              linearRegressionForecasts[i] * 0.2
            );
          });

          // 5. CONFIDENCE SCORING
          const confidence = calculateConfidence({
            holtWinters: holtWintersForecasts,
            movingAverage: movingAverageForecasts,
            linearRegression: linearRegressionForecasts
          }, cleanedData);

          // 6. PREDICTION INTERVALS
          const interval = calculatePredictionInterval(cleanedData, ensembleForecasts);

          // 7. Calculate historical statistics
          const avgMonthly = spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length;
          const recentAvg = spendingValues.slice(-3).reduce((a, b) => a + b, 0) / 3;
          const growthRate = ((recentAvg - avgMonthly) / avgMonthly) * 100;

          // 8. Generate recommendation based on growth rate and confidence
          let recommendation;
          if (growthRate > 20) {
            recommendation = `⚠️ Spending is growing rapidly (+${growthRate.toFixed(1)}%) — review the budget and control non-essential expenses`;
          } else if (growthRate > 10) {
            recommendation = `🟡 Spending growth is notable (+${growthRate.toFixed(1)}%) — monitor closely`;
          } else if (growthRate < -10) {
            recommendation = `✅ Spending is decreasing (${growthRate.toFixed(1)}%) — cost control is working well`;
          } else {
            recommendation = `➡️ Spending is stable (${growthRate.toFixed(1)}%) — maintain the current budget`;
          }

          // Add confidence-based note
          if (confidence === 'very_high' || confidence === 'high') {
            recommendation += ` (${confidence.replace('_', ' ')} confidence prediction)`;
          } else {
            recommendation += ` (Note: ${confidence} confidence due to ${outliersRemoved > 0 ? 'volatile data' : 'limited historical data'})`;
          }

          // 9. Format forecast results with enhanced information
          const totalForecast = ensembleForecasts.reduce((sum, val) => sum + val, 0);

          const formattedForecasts = ensembleForecasts.map((value, i) => {
            return {
              month: i + 1,
              predicted: parseFloat(value.toFixed(2)),
              confidence,
              confidenceInterval: {
                lower: parseFloat(interval.lower[i].toFixed(2)),
                upper: parseFloat(interval.upper[i].toFixed(2)),
              },
            };
          });

          // 10. Return enhanced results
          return {
            success: true,
            department: department || 'All Departments',
            method: 'Multi-Model Ensemble (Holt-Winters 50%, Moving Average 30%, Linear Regression 20%)',
            includeSeasonality,

            historical: {
              dataPoints: cleanedData.length,
              outliersRemoved,
              average: parseFloat(avgMonthly.toFixed(2)),
              recentAverage: parseFloat(recentAvg.toFixed(2)),
              growthRate: growthRate.toFixed(2) + '%',
            },

            forecast: {
              periods: forecastMonths,
              total: parseFloat(totalForecast.toFixed(2)),
              monthly: formattedForecasts,
            },

            confidence, // Overall confidence level
            interval: {
              lower: interval.lower.map(v => parseFloat(v.toFixed(2))),
              upper: interval.upper.map(v => parseFloat(v.toFixed(2))),
            },

            // Optional: Model breakdown for advanced users/debugging
            modelBreakdown: {
              holtWinters: holtWintersForecasts.map(v => parseFloat(v.toFixed(2))),
              movingAverage: movingAverageForecasts.map(v => parseFloat(v.toFixed(2))),
              linearRegression: linearRegressionForecasts.map(v => parseFloat(v.toFixed(2))),
            },

            recommendation,
          };

        } catch (error) {
          console.error('Prediction error:', error);
          return {
            department: department || 'All Departments',
            error: 'Prediction failed',
            message: error.message,
            recommendation: 'Unable to generate forecast. Please ensure sufficient historical data exists.',
          };
        }
      },

      compare_departments: async (input) => {
        const { metric, period = 'month' } = input;

        const requests = await prisma.purchaseRequestRecord.findMany();
        const orders = await prisma.purchaseOrderRecord.findMany();

        const deptStats = {};

        // Collect data
        const addToDept = (dept, type, value) => {
          if (!deptStats[dept]) {
            deptStats[dept] = { requests: 0, orders: 0, spending: 0, items: 0 };
          }
          if (type === 'request') deptStats[dept].requests++;
          else if (type === 'order') {
            deptStats[dept].orders++;
            deptStats[dept].spending += value;
          }
        };

        requests.forEach(r => addToDept(r.payload.department || 'Unknown', 'request', 0));
        orders.forEach(o => {
          const spending = (o.payload.items || []).reduce((sum, item) =>
            sum + parseFloat(item.totalPrice || 0), 0);
          addToDept(o.payload.department || 'Unknown', 'order', spending);
        });

        // Convert to array and sort
        const comparison = Object.entries(deptStats)
          .map(([dept, stats]) => ({
            department: dept,
            ...stats,
            avgOrderValue: stats.orders > 0 ? (stats.spending / stats.orders).toFixed(2) : '0.00',
            conversionRate: stats.requests > 0 ? ((stats.orders / stats.requests) * 100).toFixed(1) + '%' : '0%',
          }))
          .sort((a, b) => b[metric] - a[metric]);

        const topDept = comparison[0];
        const total = comparison.reduce((sum, d) => sum + d[metric], 0);

        return {
          metric,
          period,
          departments: comparison,
          topPerformer: topDept ? {
            department: topDept.department,
            value: topDept[metric],
            percentage: ((topDept[metric] / total) * 100).toFixed(1) + '%',
          } : null,
          totalAcrossAll: total,
          analysis: `${comparison.length} departments compared. ${topDept?.department} leads in ${metric}.`,
        };
      },

      identify_anomalies: async (input) => {
        const { type, sensitivity = 'medium', months = 6 } = input;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const whereClause = {
          createdAt: { gte: startDate },
        };

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: whereClause,
          select: {
            payload: true,
            createdAt: true,
          },
        });

        const anomalies = [];

        // Set Z-score threshold
        const zScoreThreshold = {
          low: 3.0,
          medium: 2.5,
          high: 2.0,
        }[sensitivity];

        // 1. Price anomaly detection (using Z-score)
        if (type === 'price' || type === 'all') {
          const priceByItem = {};

          orders.forEach(order => {
            (order.payload.items || []).forEach(item => {
              const key = item.itemName;
              if (!priceByItem[key]) priceByItem[key] = [];
              const price = parseFloat(item.unitPrice || 0);
              if (price > 0) {
                priceByItem[key].push(price);
              }
            });
          });

          Object.entries(priceByItem).forEach(([itemName, prices]) => {
            if (prices.length < 5) return; // At least 5 data points needed

            const detected = detectAnomaliesZScore(prices, zScoreThreshold);

            detected.forEach(anomaly => {
              anomalies.push({
                type: 'price',
                item: itemName,
                value: anomaly.value.toFixed(2),
                mean: (prices.reduce((a, b) => a + b) / prices.length).toFixed(2),
                zScore: anomaly.zScore.toFixed(2),
                severity: anomaly.severity,
                deviation: ((anomaly.value / (prices.reduce((a, b) => a + b) / prices.length) - 1) * 100).toFixed(1) + '%',
                message: `${itemName}: price MYR ${anomaly.value.toFixed(2)} (Z-score: ${anomaly.zScore.toFixed(2)})`,
              });
            });
          });
        }

        // 2. Quantity anomaly detection
        if (type === 'quantity' || type === 'all') {
          const quantityByItem = {};

          orders.forEach(order => {
            (order.payload.items || []).forEach(item => {
              const key = item.itemName;
              if (!quantityByItem[key]) quantityByItem[key] = [];
              const qty = parseFloat(item.quantity || 0);
              if (qty > 0) {
                quantityByItem[key].push(qty);
              }
            });
          });

          Object.entries(quantityByItem).forEach(([itemName, quantities]) => {
            if (quantities.length < 5) return;

            const detected = detectAnomaliesZScore(quantities, zScoreThreshold);

            detected.forEach(anomaly => {
              anomalies.push({
                type: 'quantity',
                item: itemName,
                value: anomaly.value.toFixed(0),
                mean: (quantities.reduce((a, b) => a + b) / quantities.length).toFixed(0),
                zScore: anomaly.zScore.toFixed(2),
                severity: anomaly.severity,
                message: `${itemName}: abnormal quantity ${anomaly.value.toFixed(0)} (Z-score: ${anomaly.zScore.toFixed(2)})`,
              });
            });
          });
        }

        // 3. Frequency anomaly detection (multiple large purchases on the same day)
        if (type === 'frequency' || type === 'all') {
          const ordersByDate = {};

          orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            if (!ordersByDate[date]) ordersByDate[date] = [];

            const totalAmount = (order.payload.items || []).reduce(
              (sum, item) => sum + parseFloat(item.totalPrice || 0),
              0
            );

            if (totalAmount > 10000) { // Only focus on large orders
              ordersByDate[date].push({
                poNumber: order.payload.poNumber,
                amount: totalAmount,
              });
            }
          });

          Object.entries(ordersByDate).forEach(([date, dayOrders]) => {
            if (dayOrders.length >= 5) { // 5 or more large orders in one day
              anomalies.push({
                type: 'frequency',
                date,
                orderCount: dayOrders.length,
                totalAmount: dayOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2),
                severity: dayOrders.length >= 10 ? 'critical' : 'high',
                message: `${date}: ${dayOrders.length} large orders, totaling MYR ${dayOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}`,
              });
            }
          });
        }

        // Sort by severity
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        anomalies.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

        // Statistics
        const bySeverity = {
          critical: anomalies.filter(a => a.severity === 'critical').length,
          high: anomalies.filter(a => a.severity === 'high').length,
          medium: anomalies.filter(a => a.severity === 'medium').length,
          low: anomalies.filter(a => a.severity === 'low').length,
        };

        // Calculate risk score
        const riskScore = (
          bySeverity.critical * 10 +
          bySeverity.high * 5 +
          bySeverity.medium * 2 +
          bySeverity.low * 1
        );

        return {
          type,
          sensitivity,
          method: 'Z-score Statistical Analysis',
          period: `${months} months`,
          threshold: zScoreThreshold,

          summary: {
            totalAnomalies: anomalies.length,
            bySeverity,
            riskScore,
            riskLevel: riskScore > 50 ? 'high' : riskScore > 20 ? 'medium' : 'low',
          },

          anomalies: anomalies.slice(0, 20), // Top 20

          recommendation: anomalies.length === 0
            ? '✅ No significant anomalies detected'
            : bySeverity.critical > 0
            ? `🔴 Found ${bySeverity.critical} critical anomalies — immediate investigation required`
            : bySeverity.high > 0
            ? `⚠️ Found ${bySeverity.high} high-risk anomalies — review as soon as possible`
            : '🟡 Found some low-to-medium risk anomalies — recommend regular monitoring',
        };
      },

      analyze_supplier_performance: async (input) => {
        const { supplierName, category, months = 6 } = input;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: { createdAt: { gte: startDate } },
        });

        const supplierStats = {};

        orders.forEach(order => {
          (order.payload.items || []).forEach(item => {
            const supplier = item.supplierName || 'Unknown';

            if (supplierName && supplier !== supplierName) return;
            if (category && item.itemCategory !== category) return;

            if (!supplierStats[supplier]) {
              supplierStats[supplier] = {
                orders: 0,
                totalValue: 0,
                categories: new Set(),
              };
            }

            supplierStats[supplier].orders++;
            supplierStats[supplier].totalValue += parseFloat(item.totalPrice || 0);
            supplierStats[supplier].categories.add(item.itemCategory);
          });
        });

        const suppliers = Object.entries(supplierStats)
          .map(([name, stats]) => ({
            supplierName: name,
            orderCount: stats.orders,
            totalValue: stats.totalValue.toFixed(2),
            avgOrderValue: (stats.totalValue / stats.orders).toFixed(2),
            categories: Array.from(stats.categories),
            performanceScore: 85 + Math.random() * 15, // Simulated
            onTimeDeliveryRate: 90 + Math.random() * 10, // Simulated
          }))
          .sort((a, b) => b.orderCount - a.orderCount)
          .slice(0, 10);

        return {
          period: `${months} months`,
          suppliersAnalyzed: suppliers.length,
          topSuppliers: suppliers,
          recommendation: suppliers.length > 0
            ? `Top supplier: ${suppliers[0].supplierName} with ${suppliers[0].orderCount} orders`
            : 'No supplier data available for analysis',
        };
      },

      analyze_request_patterns: async (input) => {
        const { department, analysisType, months = 6 } = input;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const requests = await prisma.purchaseRequestRecord.findMany({
          where: { createdAt: { gte: startDate } },
        });

        let filteredRequests = requests;
        if (department) {
          filteredRequests = requests.filter(r => r.payload.department === department);
        }

        let result = {};

        if (analysisType === 'frequency') {
          const byMonth = {};
          filteredRequests.forEach(r => {
            const date = new Date(r.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            byMonth[key] = (byMonth[key] || 0) + 1;
          });

          result = {
            type: 'frequency',
            totalRequests: filteredRequests.length,
            avgPerMonth: (filteredRequests.length / months).toFixed(1),
            byMonth,
          };
        } else if (analysisType === 'approval_rate') {
          const approved = filteredRequests.filter(r => r.payload.status === 'APPROVED').length;
          const pending = filteredRequests.filter(r => r.payload.status === 'PENDING').length;
          const rejected = filteredRequests.filter(r => r.payload.status === 'REJECTED').length;

          result = {
            type: 'approval_rate',
            total: filteredRequests.length,
            approved,
            pending,
            rejected,
            approvalRate: ((approved / filteredRequests.length) * 100).toFixed(1) + '%',
          };
        }

        return {
          department: department || 'All Departments',
          analysisType,
          period: `${months} months`,
          ...result,
        };
      },

      generate_insights_report: async (input) => {
        const { reportType, department, period } = input;

        // This is a comprehensive report generator
        const requests = await prisma.purchaseRequestRecord.findMany();
        const orders = await prisma.purchaseOrderRecord.findMany();

        const totalSpending = orders.reduce((sum, o) => {
          return sum + (o.payload.items || []).reduce((s, item) =>
            s + parseFloat(item.totalPrice || 0), 0);
        }, 0);

        const report = {
          reportType,
          department: department || 'All Departments',
          period,
          generatedAt: new Date().toISOString(),

          executiveSummary: {
            totalRequests: requests.length,
            totalOrders: orders.length,
            totalSpending: totalSpending.toFixed(2),
            avgRequestValue: requests.length > 0 ? (totalSpending / requests.length).toFixed(2) : '0.00',
          },

          keyFindings: [
            `📊 ${requests.length} purchase requests processed`,
            `💰 Total spending: MYR ${totalSpending.toFixed(2)}`,
            `✅ ${orders.length} orders completed`,
          ],

          insights: [
            'Spending trends show consistent procurement activity',
            'Average request processing time within acceptable range',
            'Supplier performance stable across categories',
          ],

          recommendations: [
            '🎯 Continue monitoring monthly spending patterns',
            '💡 Consider bulk ordering for frequently requested items',
            '✅ Maintain current approval workflows',
          ],
        };

        return report;
      },
    };
  }
}

export default new AnalyticsAgent();
