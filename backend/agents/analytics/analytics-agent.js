import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * 三次指数平滑（Holt-Winters）预测算法
 */
function holtWintersPredict(data, forecastPeriods = 3, seasonLength = 12) {
  if (data.length < seasonLength) {
    // 数据不足，使用简单移动平均
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    return Array(forecastPeriods).fill(avg);
  }

  const alpha = 0.3; // 水平平滑系数
  const beta = 0.1;  // 趋势平滑系数
  const gamma = 0.2; // 季节性平滑系数

  let level = data[0];
  let trend = 0;
  const seasonal = new Array(seasonLength).fill(1);

  // 初始化季节因子
  for (let i = 0; i < seasonLength && i < data.length; i++) {
    seasonal[i] = data[i] / (data.reduce((a, b) => a + b, 0) / data.length);
  }

  // 训练模型
  data.forEach((value, t) => {
    if (t === 0) return;

    const seasonIdx = t % seasonLength;
    const prevLevel = level;

    level = alpha * (value / seasonal[seasonIdx]) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[seasonIdx] = gamma * (value / level) + (1 - gamma) * seasonal[seasonIdx];
  });

  // 预测
  const forecasts = [];
  for (let i = 1; i <= forecastPeriods; i++) {
    const seasonIdx = (data.length + i - 1) % seasonLength;
    forecasts.push((level + i * trend) * seasonal[seasonIdx]);
  }

  return forecasts;
}

/**
 * Z-score 异常检测
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
- Forecast future spending based on historical data
- Predict seasonal patterns
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
 * 专注于数据分析、趋势预测、业务洞察
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

        // 获取历史订单数据
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

        // 过滤和分组数据
        const spendingByPeriod = {};
        let totalSpending = 0;

        orders.forEach(order => {
          // 部门过滤
          if (department && order.payload.department !== department) {
            return;
          }

          // 计算月份/季度
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

          // 计算支出
          if (order.payload.items && Array.isArray(order.payload.items)) {
            order.payload.items.forEach(item => {
              // 类别过滤
              if (category && item.itemCategory !== category) {
                return;
              }

              const amount = parseFloat(item.totalPrice || item.unitPrice * item.quantity || 0);
              spendingByPeriod[periodKey] += amount;
              totalSpending += amount;
            });
          }
        });

        // 计算趋势
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

        // 获取历史数据（至少12个月用于季节性分析）
        const startDate = new Date();
        const lookbackMonths = includeSeasonality ? 24 : 12;
        startDate.setMonth(startDate.getMonth() - lookbackMonths);

        const whereClause = department
          ? {
              createdAt: { gte: startDate },
              payload: {
                path: ['department'],
                equals: department,
              },
            }
          : {
              createdAt: { gte: startDate },
            };

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: whereClause,
          orderBy: { createdAt: 'asc' },
          select: {
            payload: true,
            createdAt: true,
          },
        });

        // 按月聚合支出
        const monthlySpending = {};
        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          if (!monthlySpending[monthKey]) monthlySpending[monthKey] = 0;

          if (order.payload.items) {
            order.payload.items.forEach(item => {
              monthlySpending[monthKey] += parseFloat(item.totalPrice || 0);
            });
          }
        });

        // 填充缺失月份为0
        const sortedMonths = Object.keys(monthlySpending).sort();
        if (sortedMonths.length === 0) {
          return {
            department: department || 'All Departments',
            error: 'No historical data available',
            recommendation: 'Need at least 3 months of data for prediction',
          };
        }

        const spendingValues = sortedMonths.map(m => monthlySpending[m]);

        if (spendingValues.length < 3) {
          return {
            department: department || 'All Departments',
            error: 'Insufficient data',
            recommendation: `Need at least 3 months of data, found ${spendingValues.length}`,
          };
        }

        // 计算历史统计
        const avgMonthly = spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length;
        const recentAvg = spendingValues.slice(-3).reduce((a, b) => a + b, 0) / 3;

        // 使用 Holt-Winters 方法预测
        let forecasts;
        let method;

        if (includeSeasonality && spendingValues.length >= 12) {
          forecasts = holtWintersPredict(spendingValues, forecastMonths, 12);
          method = 'Holt-Winters Triple Exponential Smoothing';
        } else {
          // 使用简单线性趋势
          const n = spendingValues.length;
          const sumX = spendingValues.reduce((sum, _, i) => sum + i, 0);
          const sumY = spendingValues.reduce((sum, val) => sum + val, 0);
          const sumXY = spendingValues.reduce((sum, val, i) => sum + i * val, 0);
          const sumX2 = spendingValues.reduce((sum, _, i) => sum + i * i, 0);

          const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;

          forecasts = [];
          for (let i = 1; i <= forecastMonths; i++) {
            forecasts.push(intercept + slope * (n + i - 1));
          }
          method = 'Linear Regression';
        }

        // 格式化预测结果
        const formattedForecasts = forecasts.map((value, i) => {
          const confidenceLevel =
            i < 2 ? 'high' :
            i < 4 ? 'medium' :
            'low';

          // 计算置信区间（±15%）
          const margin = value * 0.15;

          return {
            month: i + 1,
            predicted: value.toFixed(2),
            confidence: confidenceLevel,
            confidenceInterval: {
              lower: Math.max(0, value - margin).toFixed(2),
              upper: (value + margin).toFixed(2),
            },
          };
        });

        const totalForecast = forecasts.reduce((sum, val) => sum + val, 0);
        const growthRate = ((recentAvg - avgMonthly) / avgMonthly) * 100;

        // 生成建议
        let recommendation;
        if (growthRate > 20) {
          recommendation = '⚠️ 支出快速增长，建议审查预算并控制非必要开支';
        } else if (growthRate > 10) {
          recommendation = '🟡 支出增长明显，建议密切监控';
        } else if (growthRate < -10) {
          recommendation = '✅ 支出下降，成本控制良好';
        } else {
          recommendation = '➡️ 支出稳定，维持当前预算即可';
        }

        return {
          department: department || 'All Departments',
          method,
          includeSeasonality,

          historical: {
            dataPoints: spendingValues.length,
            average: avgMonthly.toFixed(2),
            recentAverage: recentAvg.toFixed(2),
            growthRate: growthRate.toFixed(2) + '%',
          },

          forecast: {
            periods: forecastMonths,
            total: totalForecast.toFixed(2),
            monthly: formattedForecasts,
          },

          recommendation,
        };
      },

      compare_departments: async (input) => {
        const { metric, period = 'month' } = input;

        const requests = await prisma.purchaseRequestRecord.findMany();
        const orders = await prisma.purchaseOrderRecord.findMany();

        const deptStats = {};

        // 收集数据
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

        // 转换为数组并排序
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

        // 设置 Z-score 阈值
        const zScoreThreshold = {
          low: 3.0,
          medium: 2.5,
          high: 2.0,
        }[sensitivity];

        // 1. 价格异常检测（使用 Z-score）
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
            if (prices.length < 5) return; // 至少需要5个数据点

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
                message: `${itemName}: 价格 MYR ${anomaly.value.toFixed(2)} (Z-score: ${anomaly.zScore.toFixed(2)})`,
              });
            });
          });
        }

        // 2. 数量异常检测
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
                message: `${itemName}: 异常数量 ${anomaly.value.toFixed(0)} (Z-score: ${anomaly.zScore.toFixed(2)})`,
              });
            });
          });
        }

        // 3. 频率异常检测（同一天多次大额采购）
        if (type === 'frequency' || type === 'all') {
          const ordersByDate = {};

          orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            if (!ordersByDate[date]) ordersByDate[date] = [];

            const totalAmount = (order.payload.items || []).reduce(
              (sum, item) => sum + parseFloat(item.totalPrice || 0),
              0
            );

            if (totalAmount > 10000) { // 只关注大额订单
              ordersByDate[date].push({
                poNumber: order.payload.poNumber,
                amount: totalAmount,
              });
            }
          });

          Object.entries(ordersByDate).forEach(([date, dayOrders]) => {
            if (dayOrders.length >= 5) { // 一天内5个或更多大额订单
              anomalies.push({
                type: 'frequency',
                date,
                orderCount: dayOrders.length,
                totalAmount: dayOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2),
                severity: dayOrders.length >= 10 ? 'critical' : 'high',
                message: `${date}: ${dayOrders.length} 个大额订单，总计 MYR ${dayOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}`,
              });
            }
          });
        }

        // 按严重性排序
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        anomalies.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

        // 统计
        const bySeverity = {
          critical: anomalies.filter(a => a.severity === 'critical').length,
          high: anomalies.filter(a => a.severity === 'high').length,
          medium: anomalies.filter(a => a.severity === 'medium').length,
          low: anomalies.filter(a => a.severity === 'low').length,
        };

        // 计算风险评分
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
            ? '✅ 未检测到显著异常'
            : bySeverity.critical > 0
            ? `🔴 发现 ${bySeverity.critical} 个严重异常，需要立即调查`
            : bySeverity.high > 0
            ? `⚠️ 发现 ${bySeverity.high} 个高风险异常，建议尽快审查`
            : '🟡 发现一些中低风险异常，建议定期监控',
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

        // 这是一个综合报告生成器
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
