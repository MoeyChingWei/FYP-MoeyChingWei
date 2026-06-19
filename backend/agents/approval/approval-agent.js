import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * 计算总金额
 */
function calculateTotalAmount(lineItems) {
  if (!lineItems || lineItems.length === 0) return 0;
  return lineItems.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0));
  }, 0);
}

/**
 * 获取日期范围
 */
function getDateRangeForPeriod(period) {
  const end = new Date();
  const start = new Date();

  if (period === 'month') {
    start.setMonth(start.getMonth() - 1);
  } else if (period === 'quarter') {
    start.setMonth(start.getMonth() - 3);
  } else if (period === 'year') {
    start.setFullYear(start.getFullYear() - 1);
  }

  return { start, end };
}

/**
 * 计算金融风险评分 (0-25分)
 */
async function calculateFinancialRisk(amount, department) {
  let score = 0;
  const details = [];

  // 1. 金额绝对值风险 (0-15分)
  if (amount > 100000) {
    score += 15;
    details.push(`金额超过10万 (${amount.toFixed(2)})，属于大额采购`);
  } else if (amount > 50000) {
    score += 10;
    details.push(`金额超过5万 (${amount.toFixed(2)})，需要注意`);
  } else if (amount > 10000) {
    score += 5;
    details.push(`金额适中 (${amount.toFixed(2)})`);
  } else {
    details.push(`金额较小 (${amount.toFixed(2)})`);
  }

  // 2. 预算利用率风险 (0-10分)
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const whereClause = department
      ? {
          createdAt: { gte: monthStart },
          payload: { path: ['department'], equals: department },
        }
      : { createdAt: { gte: monthStart } };

    const monthlyOrders = await prisma.purchaseOrderRecord.findMany({
      where: whereClause,
      select: { payload: true },
    });

    const monthlySpent = monthlyOrders.reduce((sum, order) => {
      return sum + (order.payload.items || []).reduce((s, item) =>
        s + parseFloat(item.totalPrice || 0), 0);
    }, 0);

    // 假设预算（实际项目应从预算表获取）
    const estimatedBudget = 50000;
    const utilizationRate = (monthlySpent / estimatedBudget) * 100;

    if (utilizationRate > 90) {
      score += 10;
      details.push(`预算已使用${utilizationRate.toFixed(1)}%，接近上限`);
    } else if (utilizationRate > 70) {
      score += 5;
      details.push(`预算已使用${utilizationRate.toFixed(1)}%`);
    } else {
      details.push(`预算使用率：${utilizationRate.toFixed(1)}%`);
    }
  } catch (error) {
    details.push('无法计算预算利用率');
  }

  return { score: Math.min(score, 25), details };
}

/**
 * 计算供应商风险评分 (0-20分)
 */
async function calculateSupplierRisk(lineItems) {
  let score = 0;
  const details = [];

  if (!lineItems || lineItems.length === 0) {
    score += 10;
    details.push('没有line items信息');
    return { score, details };
  }

  for (const item of lineItems) {
    if (!item.supplierName) {
      score += 5;
      details.push(`${item.itemName}: 未指定供应商`);
      continue;
    }

    // 检查供应商历史
    const supplierHistory = await prisma.purchaseOrderRecord.count({
      where: {
        payload: {
          path: ['items', '0', 'supplierName'],
          equals: item.supplierName,
        },
      },
    });

    if (supplierHistory === 0) {
      score += 8;
      details.push(`${item.supplierName}: 新供应商，无历史记录`);
    } else if (supplierHistory < 5) {
      score += 4;
      details.push(`${item.supplierName}: 合作次数较少 (${supplierHistory}次)`);
    } else {
      details.push(`${item.supplierName}: 可靠供应商 (${supplierHistory}次合作)`);
    }
  }

  return { score: Math.min(score, 20), details };
}

/**
 * 计算合规风险评分 (0-20分)
 */
function calculateComplianceRisk(payload, totalAmount) {
  let score = 0;
  const details = [];

  // 1. 预算合规 (0-10分)
  if (totalAmount > 100000) {
    score += 10;
    details.push('金额超过标准采购限额，需要董事会批准');
  } else if (totalAmount > 50000) {
    score += 6;
    details.push('金额超过5万，需要高管批准');
  } else if (totalAmount > 10000) {
    score += 3;
    details.push('金额超过1万，需要经理批准');
  }

  // 2. 文档完整性 (0-10分)
  if (!payload.lineItems || payload.lineItems.length === 0) {
    score += 10;
    details.push('❌ 缺少line items');
  } else {
    const missingPrices = payload.lineItems.filter(item => !item.unitPrice || item.unitPrice === 0);
    if (missingPrices.length > 0) {
      score += 5;
      details.push(`⚠️ ${missingPrices.length}个商品缺少价格`);
    }
  }

  return { score: Math.min(score, 20), details };
}

/**
 * 计算历史风险评分 (0-15分)
 */
async function calculateHistoricalRisk(userId, department) {
  let score = 0;
  const details = [];

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userRequests = await prisma.purchaseRequestRecord.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        payload: {
          path: ['createdByUserId'],
          equals: userId,
        },
      },
      select: { payload: true },
    });

    const total = userRequests.length;
    const approved = userRequests.filter(r => r.payload.status === 'APPROVED').length;
    const rejected = userRequests.filter(r => r.payload.status === 'REJECTED').length;

    if (total === 0) {
      score += 5;
      details.push('新用户，无历史记录');
    } else {
      const approvalRate = approved / total;
      const rejectionRate = rejected / total;

      if (rejectionRate > 0.3) {
        score += 15;
        details.push(`高拒绝率：${(rejectionRate * 100).toFixed(1)}% (${rejected}/${total})`);
      } else if (rejectionRate > 0.15) {
        score += 8;
        details.push(`中等拒绝率：${(rejectionRate * 100).toFixed(1)}% (${rejected}/${total})`);
      } else if (approvalRate > 0.9) {
        details.push(`✅ 优秀批准历史：${(approvalRate * 100).toFixed(1)}% (${approved}/${total})`);
      } else {
        details.push(`批准率：${(approvalRate * 100).toFixed(1)}% (${approved}/${total})`);
      }
    }
  } catch (error) {
    details.push('无法查询历史记录');
  }

  return { score: Math.min(score, 15), details };
}

/**
 * 计算文档完整性风险评分 (0-10分)
 */
function calculateDocumentationRisk(payload) {
  let score = 0;
  const details = [];

  const requiredFields = ['prNumber', 'department', 'requestBy', 'lineItems'];
  const missingFields = requiredFields.filter(field => !payload[field]);

  if (missingFields.length > 0) {
    score += missingFields.length * 3;
    details.push(`缺少必填字段：${missingFields.join(', ')}`);
  }

  if (payload.lineItems && payload.lineItems.length > 0) {
    const incompleteItems = payload.lineItems.filter(item =>
      !item.itemName || !item.quantity || !item.unitOfMeasurement
    );

    if (incompleteItems.length > 0) {
      score += 4;
      details.push(`${incompleteItems.length}个商品信息不完整`);
    }
  }

  return { score: Math.min(score, 10), details };
}

/**
 * 计算紧急程度风险评分 (0-10分)
 */
function calculateUrgencyRisk(urgency) {
  let score = 0;
  const details = [];

  if (urgency === 'critical') {
    score = 10;
    details.push('🔴 紧急采购，可能绕过正常审批流程');
  } else if (urgency === 'urgent') {
    score = 6;
    details.push('🟡 加急采购，需要快速决策');
  } else {
    details.push('✅ 正常采购流程');
  }

  return { score, details };
}

const APPROVAL_AGENT_SYSTEM_PROMPT = `You are the Approval Advisor for OptiMind ERP system.

YOUR IDENTITY:
- Name: Approval Advisor
- Role: Risk management and compliance specialist
- Expertise: Request evaluation, risk assessment, policy compliance

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR PERSONALITY:
- Cautious but fair
- Policy-focused and detail-oriented
- Risk-aware and compliance-driven
- Thorough in evaluation
- Objective and unbiased

YOUR COMMUNICATION STYLE:
- Start with "From a risk management perspective..."
- Always explain the "WHY" behind recommendations
- Use risk indicators: 🟢 (low), 🟡 (medium), 🔴 (high)
- Reference policies and thresholds
- Be diplomatic but clear about concerns

YOUR THINKING PROCESS:
1. **Risk Assessment**: Evaluate risk level (Low/Medium/High)
2. **Policy Check**: Verify compliance with company policies
3. **Historical Review**: Check similar past requests
4. **Anomaly Detection**: Flag unusual patterns
5. **Recommendation**: Approve/Review/Reject with reasoning

## Risk Assessment Framework

### Risk Factors to Evaluate:

**Financial Risk**:
- Total amount vs department budget
- Price vs historical average
- Unusual quantity requests
- Supplier reliability

**Compliance Risk**:
- Approval authority limits
- Procurement policy violations
- Missing required information
- Proper documentation

**Operational Risk**:
- Urgency vs preparation time
- Supplier delivery capability
- Impact on operations if delayed
- Alternative options available

**Historical Risk**:
- Similar requests approved/rejected
- Requester's approval history
- Department spending patterns
- Supplier performance history

## Risk Levels

🟢 **LOW RISK** (Recommend Approve):
- Within normal parameters
- Complete documentation
- Established supplier
- Standard items
- Within budget

🟡 **MEDIUM RISK** (Recommend Review):
- Slightly above average price
- New supplier
- Large quantity
- Near budget limit
- Missing minor details

🔴 **HIGH RISK** (Recommend Reject/Hold):
- Significantly over budget
- Unusually high price
- Unknown supplier
- Incomplete information
- Policy violations
- Suspicious patterns

## Response Format

For every approval request evaluation:

**🔍 RISK ASSESSMENT:**
- Overall Risk Level: 🟢/🟡/🔴
- Financial Risk: [details]
- Compliance Risk: [details]
- Operational Risk: [details]

**📋 POLICY COMPLIANCE:**
- Budget Status: [within/exceeding]
- Authority Level: [appropriate/requires escalation]
- Documentation: [complete/incomplete]
- Policy Violations: [none/list issues]

**📊 HISTORICAL CONTEXT:**
- Similar Requests: [count] in past [period]
- Average Price: [if applicable]
- Approval Rate: [percentage]
- Patterns: [any concerns]

**🎯 RECOMMENDATION:**
- Decision: ✅ APPROVE / ⚠️ REVIEW / ❌ REJECT
- Reasoning: [clear explanation]
- Conditions: [if any]
- Next Steps: [what should happen]

## Example Evaluation

"From a risk management perspective, I've evaluated this purchase request:

🔍 RISK ASSESSMENT:
Overall Risk Level: 🟡 MEDIUM
- Financial: MYR 15,000 (85% of monthly IT budget)
- Compliance: Minor - missing delivery timeline
- Operational: Low - standard equipment

📋 POLICY COMPLIANCE:
- Budget Status: Within allocation (85% utilized)
- Authority Level: Requires Manager approval (amount > MYR 10,000)
- Documentation: 90% complete (delivery date needed)
- Policy Violations: None

📊 HISTORICAL CONTEXT:
- 12 similar laptop requests in past 6 months
- Average price: MYR 4,200 (this request: MYR 4,500, +7%)
- Approval rate: 92%
- Pattern: Normal procurement cycle

🎯 RECOMMENDATION: ⚠️ REVIEW BEFORE APPROVAL

Reasoning:
1. Amount is within budget but near monthly limit
2. Price is slightly higher than average (+7%)
3. Missing delivery timeline (required for planning)

Conditions for Approval:
1. Add expected delivery date
2. Confirm price includes warranty
3. Manager approval required (per policy)

Next Steps:
1. Requester adds delivery timeline
2. Route to IT Manager for approval
3. Proceed once conditions met"

## Available Tools

- evaluate_purchase_request: Comprehensive risk assessment
- check_budget_status: Verify budget availability
- review_approval_history: Check requester's history
- check_policy_compliance: Validate against policies
- compare_similar_requests: Find and compare similar requests
- calculate_risk_score: Calculate numerical risk score
- recommend_approval_action: Generate final recommendation

Remember: You are a GUARDIAN of company resources. Be thorough, fair, and always explain your reasoning. Help approvers make informed decisions.`;

/**
 * Approval Agent - Risk Management and Compliance Specialist
 *
 * 专注于采购申请评估、风险分析、政策合规检查
 */
class ApprovalAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'approval',
      name: 'Approval Advisor',
      description: 'Risk management specialist for purchase request evaluation',
      personality: 'Cautious, fair, policy-focused, and risk-aware',
      expertise: 'Risk assessment, policy compliance, approval recommendations',
      systemPromptTemplate: APPROVAL_AGENT_SYSTEM_PROMPT,
      tools: ApprovalAgent.defineTools(),
      toolHandlers: ApprovalAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'evaluate_purchase_request',
        description: 'Perform comprehensive risk assessment of a purchase request',
        input_schema: {
          type: 'object',
          properties: {
            requestId: {
              type: 'string',
              description: 'Purchase request ID or PR number'
            },
            includeHistorical: {
              type: 'boolean',
              description: 'Include historical comparison (default true)'
            }
          },
          required: ['requestId'],
        },
      },
      {
        name: 'check_budget_status',
        description: 'Check budget availability and utilization for a department',
        input_schema: {
          type: 'object',
          properties: {
            department: {
              type: 'string',
              description: 'Department name'
            },
            requestAmount: {
              type: 'number',
              description: 'Requested amount to check against budget'
            },
            period: {
              type: 'string',
              enum: ['month', 'quarter', 'year'],
              description: 'Budget period (default month)'
            }
          },
          required: ['department'],
        },
      },
      {
        name: 'review_approval_history',
        description: 'Review approval history for a user or department',
        input_schema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'User ID to review'
            },
            department: {
              type: 'string',
              description: 'Department to review (optional)'
            },
            months: {
              type: 'number',
              description: 'Look back period in months (default 6)'
            }
          },
        },
      },
      {
        name: 'check_policy_compliance',
        description: 'Check if a request complies with procurement policies',
        input_schema: {
          type: 'object',
          properties: {
            requestId: {
              type: 'string',
              description: 'Purchase request ID'
            },
            checkType: {
              type: 'string',
              enum: ['all', 'budget', 'authority', 'documentation', 'supplier'],
              description: 'Type of compliance check'
            }
          },
          required: ['requestId'],
        },
      },
      {
        name: 'compare_similar_requests',
        description: 'Find and compare similar historical requests',
        input_schema: {
          type: 'object',
          properties: {
            itemName: {
              type: 'string',
              description: 'Item name or category'
            },
            category: {
              type: 'string',
              description: 'Item category'
            },
            limit: {
              type: 'number',
              description: 'Number of similar requests to find (default 5)'
            }
          },
        },
      },
      {
        name: 'calculate_risk_score',
        description: 'Calculate numerical risk score (0-100) for a request',
        input_schema: {
          type: 'object',
          properties: {
            requestId: {
              type: 'string',
              description: 'Purchase request ID'
            },
            factors: {
              type: 'array',
              items: { type: 'string' },
              description: 'Risk factors to consider (optional)'
            }
          },
          required: ['requestId'],
        },
      },
      {
        name: 'recommend_approval_action',
        description: 'Generate final approval recommendation with reasoning',
        input_schema: {
          type: 'object',
          properties: {
            requestId: {
              type: 'string',
              description: 'Purchase request ID'
            },
            detailLevel: {
              type: 'string',
              enum: ['brief', 'standard', 'detailed'],
              description: 'Level of detail in recommendation'
            }
          },
          required: ['requestId'],
        },
      },
    ];
  }

  static defineToolHandlers() {
    return {
      evaluate_purchase_request: async (input) => {
        const { requestId, includeHistorical = true } = input;

        // 查找采购申请
        const request = await prisma.purchaseRequestRecord.findUnique({
          where: { localId: requestId },
        });

        if (!request) {
          return { success: false, error: 'Purchase request not found' };
        }

        const payload = request.payload;

        // 计算总金额
        const totalAmount = (payload.lineItems || []).reduce((sum, item) => {
          return sum + (item.unitPrice * item.quantity || 0);
        }, 0);

        // 获取部门历史支出
        const deptRequests = await prisma.purchaseRequestRecord.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 过去30天
            },
          },
        });

        const deptSpending = deptRequests
          .filter(r => r.payload.department === payload.department)
          .reduce((sum, r) => {
            return sum + (r.payload.lineItems || []).reduce((s, item) =>
              s + (item.unitPrice * item.quantity || 0), 0);
          }, 0);

        // 风险评估
        const budgetUtilization = totalAmount / (deptSpending + totalAmount) * 100;
        let financialRisk = 'low';
        if (budgetUtilization > 80) financialRisk = 'high';
        else if (budgetUtilization > 50) financialRisk = 'medium';

        let complianceRisk = 'low';
        if (totalAmount > 50000) complianceRisk = 'high';
        else if (totalAmount > 20000) complianceRisk = 'medium';

        const operationalRisk = 'low'; // 简化评估

        // 整体风险
        let overallRisk = 'low';
        if (financialRisk === 'high' || complianceRisk === 'high') {
          overallRisk = 'high';
        } else if (financialRisk === 'medium' || complianceRisk === 'medium') {
          overallRisk = 'medium';
        }

        return {
          requestId,
          prNumber: payload.prNumber,
          department: payload.department,
          requestBy: payload.requestBy,
          totalAmount: totalAmount.toFixed(2),
          itemCount: payload.lineItems?.length || 0,

          riskAssessment: {
            overallRisk,
            riskIndicator: overallRisk === 'low' ? '🟢' : overallRisk === 'medium' ? '🟡' : '🔴',
            financialRisk,
            complianceRisk,
            operationalRisk,
          },

          budgetStatus: {
            monthlySpending: deptSpending.toFixed(2),
            thisRequest: totalAmount.toFixed(2),
            utilizationPercentage: budgetUtilization.toFixed(1) + '%',
          },

          status: payload.status,
          createdAt: request.createdAt,
        };
      },

      check_budget_status: async (input) => {
        const { department, requestAmount = 0, period = 'month' } = input;

        if (!department) {
          return {
            success: false,
            error: 'Department is required',
          };
        }

        // 获取日期范围
        const dateRange = getDateRangeForPeriod(period);

        // 查询该部门在此期间的所有订单
        const whereClause = {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
          payload: {
            path: ['department'],
            equals: department,
          },
        };

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: whereClause,
          select: { payload: true },
        });

        // 计算实际支出
        const totalSpent = orders.reduce((sum, order) => {
          return sum + (order.payload.items || []).reduce((s, item) =>
            s + parseFloat(item.totalPrice || 0), 0);
        }, 0);

        // 动态预算配置（实际应从数据库Budget表获取）
        // 这里使用假设的预算值
        const budgetConfig = {
          month: 50000,
          quarter: 150000,
          year: 600000,
        };

        const allocatedBudget = budgetConfig[period] || 50000;
        const remaining = allocatedBudget - totalSpent;
        const utilizationRate = (totalSpent / allocatedBudget) * 100;
        const canAfford = remaining >= requestAmount;
        const utilizationAfter = ((totalSpent + requestAmount) / allocatedBudget) * 100;

        // 预测预算耗尽时间
        let forecastDepletion = null;
        if (totalSpent > 0 && period === 'month') {
          const daysInPeriod = (dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24);
          const dailyBurn = totalSpent / daysInPeriod;
          const remainingAfter = remaining - requestAmount;

          if (dailyBurn > 0 && remainingAfter > 0) {
            const daysUntilDepletion = remainingAfter / dailyBurn;
            forecastDepletion = {
              daysRemaining: Math.ceil(daysUntilDepletion),
              estimatedDate: new Date(Date.now() + daysUntilDepletion * 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0],
              dailyBurnRate: dailyBurn.toFixed(2),
            };
          }
        }

        // 动态建议生成
        let status, recommendation, severity;
        if (utilizationAfter > 100) {
          status = '🔴 超出预算';
          severity = 'critical';
          recommendation = '❌ 无法批准，预算不足。需要申请追加预算或推迟采购。';
        } else if (utilizationAfter > 95) {
          status = '🔴 严重超预算风险';
          severity = 'high';
          recommendation = '⚠️ 强烈建议推迟此采购，预算即将耗尽。考虑：\n1. 推迟到下个周期\n2. 削减采购量\n3. 申请紧急追加预算';
        } else if (utilizationAfter > 85) {
          status = '🟡 接近预算上限';
          severity = 'medium';
          recommendation = '⚠️ 可以批准，但需要谨慎：\n1. 这是本周期最后的重大采购机会\n2. 后续只能批准小额采购\n3. 建议监控剩余预算';
        } else if (utilizationAfter > 70) {
          status = '🟢 预算充足但需注意';
          severity = 'low';
          recommendation = '✅ 预算状况良好，可以批准。建议继续监控支出趋势。';
        } else {
          status = '🟢 预算充裕';
          severity = 'none';
          recommendation = '✅ 预算充足，无需担忧。支出健康，可以正常批准。';
        }

        // 对比历史同期
        let historicalComparison = null;
        if (period === 'month') {
          try {
            const lastMonthStart = new Date(dateRange.start);
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
            const lastMonthEnd = new Date(dateRange.start);

            const lastMonthOrders = await prisma.purchaseOrderRecord.findMany({
              where: {
                createdAt: { gte: lastMonthStart, lt: lastMonthEnd },
                payload: { path: ['department'], equals: department },
              },
              select: { payload: true },
            });

            const lastMonthSpent = lastMonthOrders.reduce((sum, order) => {
              return sum + (order.payload.items || []).reduce((s, item) =>
                s + parseFloat(item.totalPrice || 0), 0);
            }, 0);

            const changePercent = lastMonthSpent > 0
              ? ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100
              : 0;

            historicalComparison = {
              lastPeriodSpent: lastMonthSpent.toFixed(2),
              currentPeriodSpent: totalSpent.toFixed(2),
              change: (totalSpent - lastMonthSpent).toFixed(2),
              changePercent: changePercent.toFixed(1) + '%',
              trend: changePercent > 10 ? '📈 增长' : changePercent < -10 ? '📉 下降' : '➡️ 持平',
            };
          } catch (error) {
            // 忽略历史对比错误
          }
        }

        return {
          department,
          period,
          severity,

          budget: {
            allocated: allocatedBudget.toFixed(2),
            spent: totalSpent.toFixed(2),
            remaining: remaining.toFixed(2),
            utilizationRate: utilizationRate.toFixed(1) + '%',
          },

          request: {
            amount: requestAmount.toFixed(2),
            canAfford,
            utilizationAfter: utilizationAfter.toFixed(1) + '%',
            remainingAfter: (remaining - requestAmount).toFixed(2),
          },

          status,
          recommendation,

          forecast: forecastDepletion,
          historicalComparison,

          warnings: utilizationAfter > 90
            ? ['⚠️ 预算使用率超过90%', '❌ 后续采购将受限', '📋 建议规划下周期预算']
            : utilizationAfter > 70
            ? ['⚠️ 预算使用率超过70%', '📊 建议密切监控']
            : [],
        };
      },

      review_approval_history: async (input) => {
        const { userId, department, months = 6 } = input;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const requests = await prisma.purchaseRequestRecord.findMany({
          where: {
            createdAt: { gte: startDate },
          },
        });

        let filtered = requests;

        if (userId) {
          filtered = requests.filter(r => r.payload.createdByUserId === userId);
        } else if (department) {
          filtered = requests.filter(r => r.payload.department === department);
        }

        const total = filtered.length;
        const approved = filtered.filter(r => r.payload.status === 'APPROVED').length;
        const pending = filtered.filter(r => r.payload.status === 'PENDING').length;
        const rejected = filtered.filter(r => r.payload.status === 'REJECTED').length;

        const approvalRate = total > 0 ? (approved / total * 100).toFixed(1) : '0';

        return {
          userId,
          department,
          period: `${months} months`,
          summary: {
            totalRequests: total,
            approved,
            pending,
            rejected,
            approvalRate: approvalRate + '%',
          },
          analysis: approved / total > 0.9
            ? '✅ Excellent approval history (>90%)'
            : approved / total > 0.7
            ? '🟡 Good approval history (70-90%)'
            : '🔴 Poor approval history (<70%) - requires attention',
          recentRequests: filtered.slice(0, 5).map(r => ({
            prNumber: r.payload.prNumber,
            status: r.payload.status,
            date: r.createdAt,
          })),
        };
      },

      check_policy_compliance: async (input) => {
        const { requestId, checkType = 'all' } = input;

        const request = await prisma.purchaseRequestRecord.findUnique({
          where: { localId: requestId },
        });

        if (!request) {
          return { success: false, error: 'Request not found' };
        }

        const payload = request.payload;

        const totalAmount = (payload.lineItems || []).reduce((sum, item) =>
          sum + (item.unitPrice * item.quantity || 0), 0);

        const checks = {
          budget: {
            status: totalAmount < 100000 ? 'pass' : 'review',
            message: totalAmount < 100000
              ? '✅ Within standard procurement limit'
              : '⚠️ Exceeds standard limit - requires executive approval',
          },
          authority: {
            status: totalAmount < 10000 ? 'pass' : totalAmount < 50000 ? 'review' : 'escalate',
            message: totalAmount < 10000
              ? '✅ Manager approval sufficient'
              : totalAmount < 50000
              ? '⚠️ Requires Executive approval'
              : '🔴 Requires Board approval',
          },
          documentation: {
            status: payload.lineItems && payload.lineItems.length > 0 ? 'pass' : 'fail',
            message: payload.lineItems?.length > 0
              ? '✅ Line items documented'
              : '❌ Missing line item details',
          },
          supplier: {
            status: 'unknown',
            message: '⚠️ Supplier verification not implemented',
          },
        };

        const violations = Object.entries(checks)
          .filter(([_, check]) => check.status === 'fail')
          .map(([type, _]) => type);

        return {
          requestId,
          prNumber: payload.prNumber,
          checkType,
          checks: checkType === 'all' ? checks : { [checkType]: checks[checkType] },
          violations,
          overallCompliance: violations.length === 0 ? 'compliant' : 'non-compliant',
          recommendation: violations.length === 0
            ? '✅ All policy checks passed'
            : `❌ Policy violations found: ${violations.join(', ')}`,
        };
      },

      compare_similar_requests: async (input) => {
        const { itemName, category, limit = 5 } = input;

        const requests = await prisma.purchaseRequestRecord.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
        });

        const similar = [];

        requests.forEach(request => {
          (request.payload.lineItems || []).forEach(item => {
            const nameMatch = itemName && item.itemName.toLowerCase().includes(itemName.toLowerCase());
            const catMatch = category && item.itemCategory === category;

            if (nameMatch || catMatch) {
              similar.push({
                prNumber: request.payload.prNumber,
                itemName: item.itemName,
                category: item.itemCategory,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                status: request.payload.status,
                department: request.payload.department,
                date: request.createdAt,
              });
            }
          });
        });

        const prices = similar.map(s => s.unitPrice).filter(p => p > 0);
        const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b) / prices.length : 0;

        return {
          searchCriteria: { itemName, category },
          foundCount: similar.length,
          results: similar.slice(0, limit),
          priceAnalysis: prices.length > 0 ? {
            average: avgPrice.toFixed(2),
            min: Math.min(...prices).toFixed(2),
            max: Math.max(...prices).toFixed(2),
          } : null,
        };
      },

      calculate_risk_score: async (input) => {
        const { requestId } = input;

        const request = await prisma.purchaseRequestRecord.findUnique({
          where: { localId: requestId },
        });

        if (!request) {
          return { success: false, error: 'Request not found' };
        }

        const payload = request.payload;
        const totalAmount = calculateTotalAmount(payload.lineItems);

        // 多维度风险评估
        const factors = {
          // 1. 金融风险 (0-25分)
          financial: await calculateFinancialRisk(totalAmount, payload.department),

          // 2. 供应商风险 (0-20分)
          supplier: await calculateSupplierRisk(payload.lineItems),

          // 3. 合规风险 (0-20分)
          compliance: calculateComplianceRisk(payload, totalAmount),

          // 4. 历史风险 (0-15分)
          historical: await calculateHistoricalRisk(payload.createdByUserId, payload.department),

          // 5. 文档完整性风险 (0-10分)
          documentation: calculateDocumentationRisk(payload),

          // 6. 紧急程度风险 (0-10分)
          urgency: calculateUrgencyRisk(payload.urgency),
        };

        // 计算总分 (0-100)
        const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0);

        // 风险等级评定
        let riskLevel, indicator, recommendation;
        if (totalScore < 30) {
          riskLevel = 'low';
          indicator = '🟢';
          recommendation = '✅ 低风险，建议快速批准';
        } else if (totalScore < 60) {
          riskLevel = 'medium';
          indicator = '🟡';
          recommendation = '⚠️ 中等风险，建议详细审查后批准';
        } else {
          riskLevel = 'high';
          indicator = '🔴';
          recommendation = '🔴 高风险，建议拒绝或要求补充信息';
        }

        // 自动批准建议
        const autoApprove = totalScore < 20 && totalAmount < 5000;

        // 生成详细报告
        const detailReport = {
          financial: {
            score: factors.financial.score,
            maxScore: 25,
            percentage: ((factors.financial.score / 25) * 100).toFixed(1) + '%',
            details: factors.financial.details,
          },
          supplier: {
            score: factors.supplier.score,
            maxScore: 20,
            percentage: ((factors.supplier.score / 20) * 100).toFixed(1) + '%',
            details: factors.supplier.details,
          },
          compliance: {
            score: factors.compliance.score,
            maxScore: 20,
            percentage: ((factors.compliance.score / 20) * 100).toFixed(1) + '%',
            details: factors.compliance.details,
          },
          historical: {
            score: factors.historical.score,
            maxScore: 15,
            percentage: ((factors.historical.score / 15) * 100).toFixed(1) + '%',
            details: factors.historical.details,
          },
          documentation: {
            score: factors.documentation.score,
            maxScore: 10,
            percentage: ((factors.documentation.score / 10) * 100).toFixed(1) + '%',
            details: factors.documentation.details,
          },
          urgency: {
            score: factors.urgency.score,
            maxScore: 10,
            percentage: ((factors.urgency.score / 10) * 100).toFixed(1) + '%',
            details: factors.urgency.details,
          },
        };

        return {
          requestId,
          prNumber: payload.prNumber,
          department: payload.department,
          requestBy: payload.requestBy,
          totalAmount: totalAmount.toFixed(2),

          riskAssessment: {
            totalScore,
            maxScore: 100,
            riskLevel,
            indicator,
            autoApprove,
          },

          factorBreakdown: detailReport,

          recommendation,

          nextSteps: autoApprove
            ? ['✅ 符合自动批准条件', '无需人工审核', '系统可自动处理']
            : totalScore < 40
            ? ['📋 提交给部门经理审批', '预计1个工作日内完成']
            : totalScore < 70
            ? ['⚠️ 提交给高管审批', '需要详细审查', '预计2-3个工作日']
            : ['🔴 需要补充信息', '联系申请人clarify细节', '重新提交后再评估'],

          evaluatedAt: new Date().toISOString(),
        };
      },

      recommend_approval_action: async (input) => {
        const { requestId, detailLevel = 'standard' } = input;

        const request = await prisma.purchaseRequestRecord.findUnique({
          where: { localId: requestId },
        });

        if (!request) {
          return { success: false, error: 'Request not found' };
        }

        const payload = request.payload;
        const totalAmount = (payload.lineItems || []).reduce((sum, item) =>
          sum + (item.unitPrice * item.quantity || 0), 0);

        // 决策逻辑
        let decision = 'APPROVE';
        let conditions = [];
        let reasoning = [];

        if (totalAmount > 50000) {
          decision = 'REVIEW';
          conditions.push('Requires executive approval (amount > MYR 50,000)');
          reasoning.push('High value request exceeds standard approval threshold');
        }

        if (!payload.lineItems || payload.lineItems.length === 0) {
          decision = 'REJECT';
          conditions.push('Missing line item details');
          reasoning.push('Incomplete documentation - cannot assess request');
        }

        if (totalAmount === 0 || isNaN(totalAmount)) {
          decision = 'REVIEW';
          conditions.push('Verify pricing information');
          reasoning.push('Price information missing or incomplete');
        }

        return {
          requestId,
          prNumber: payload.prNumber,
          decision: decision === 'APPROVE' ? '✅ APPROVE' : decision === 'REVIEW' ? '⚠️ REVIEW' : '❌ REJECT',
          decisionCode: decision,
          totalAmount: totalAmount.toFixed(2),
          reasoning,
          conditions: conditions.length > 0 ? conditions : ['None - standard approval process'],
          nextSteps: decision === 'APPROVE'
            ? ['Route to appropriate approver', 'Monitor for completion']
            : decision === 'REVIEW'
            ? ['Address conditions listed', 'Re-evaluate after updates', 'Escalate if needed']
            : ['Return to requester', 'Request complete information', 'Resubmit when ready'],
          detailLevel,
        };
      },
    };
  }
}

export default new ApprovalAgent();
