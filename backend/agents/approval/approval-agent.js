import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * Calculate the total amount
 */
function calculateTotalAmount(lineItems) {
  if (!lineItems || lineItems.length === 0) return 0;
  return lineItems.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0));
  }, 0);
}

/**
 * Get the date range
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
 * Calculate the financial risk score (0-25 points)
 */
async function calculateFinancialRisk(amount, department) {
  let score = 0;
  const details = [];

  // 1. Absolute amount risk (0-15 points)
  if (amount > 100000) {
    score += 15;
    details.push(`Amount exceeds 100,000 (${amount.toFixed(2)}) — large purchase`);
  } else if (amount > 50000) {
    score += 10;
    details.push(`Amount exceeds 50,000 (${amount.toFixed(2)}) — needs attention`);
  } else if (amount > 10000) {
    score += 5;
    details.push(`Moderate amount (${amount.toFixed(2)})`);
  } else {
    details.push(`Small amount (${amount.toFixed(2)})`);
  }

  // 2. Budget utilization risk (0-10 points)
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

    // Assumed budget (a real project should fetch this from a budget table)
    const estimatedBudget = 50000;
    const utilizationRate = (monthlySpent / estimatedBudget) * 100;

    if (utilizationRate > 90) {
      score += 10;
      details.push(`Budget ${utilizationRate.toFixed(1)}% utilized — approaching the limit`);
    } else if (utilizationRate > 70) {
      score += 5;
      details.push(`Budget ${utilizationRate.toFixed(1)}% utilized`);
    } else {
      details.push(`Budget utilization: ${utilizationRate.toFixed(1)}%`);
    }
  } catch (error) {
    details.push('Unable to calculate budget utilization');
  }

  return { score: Math.min(score, 25), details };
}

/**
 * Calculate the supplier risk score (0-20 points)
 */
async function calculateSupplierRisk(lineItems) {
  let score = 0;
  const details = [];

  if (!lineItems || lineItems.length === 0) {
    score += 10;
    details.push('No line items information');
    return { score, details };
  }

  for (const item of lineItems) {
    if (!item.supplierName) {
      score += 5;
      details.push(`${item.itemName}: no supplier specified`);
      continue;
    }

    // Check the supplier's history
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
      details.push(`${item.supplierName}: new supplier, no history`);
    } else if (supplierHistory < 5) {
      score += 4;
      details.push(`${item.supplierName}: limited history (${supplierHistory} orders)`);
    } else {
      details.push(`${item.supplierName}: reliable supplier (${supplierHistory} past orders)`);
    }
  }

  return { score: Math.min(score, 20), details };
}

/**
 * Calculate the compliance risk score (0-20 points)
 */
function calculateComplianceRisk(payload, totalAmount) {
  let score = 0;
  const details = [];

  // 1. Budget compliance (0-10 points)
  if (totalAmount > 100000) {
    score += 10;
    details.push('Amount exceeds the standard procurement limit — requires board approval');
  } else if (totalAmount > 50000) {
    score += 6;
    details.push('Amount exceeds 50,000 — requires executive approval');
  } else if (totalAmount > 10000) {
    score += 3;
    details.push('Amount exceeds 10,000 — requires manager approval');
  }

  // 2. Documentation completeness (0-10 points)
  if (!payload.lineItems || payload.lineItems.length === 0) {
    score += 10;
    details.push('❌ Missing line items');
  } else {
    const missingPrices = payload.lineItems.filter(item => !item.unitPrice || item.unitPrice === 0);
    if (missingPrices.length > 0) {
      score += 5;
      details.push(`⚠️ ${missingPrices.length} item(s) missing price`);
    }
  }

  return { score: Math.min(score, 20), details };
}

/**
 * Calculate the historical risk score (0-15 points)
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
      details.push('New user, no history');
    } else {
      const approvalRate = approved / total;
      const rejectionRate = rejected / total;

      if (rejectionRate > 0.3) {
        score += 15;
        details.push(`High rejection rate: ${(rejectionRate * 100).toFixed(1)}% (${rejected}/${total})`);
      } else if (rejectionRate > 0.15) {
        score += 8;
        details.push(`Moderate rejection rate: ${(rejectionRate * 100).toFixed(1)}% (${rejected}/${total})`);
      } else if (approvalRate > 0.9) {
        details.push(`✅ Excellent approval history: ${(approvalRate * 100).toFixed(1)}% (${approved}/${total})`);
      } else {
        details.push(`Approval rate: ${(approvalRate * 100).toFixed(1)}% (${approved}/${total})`);
      }
    }
  } catch (error) {
    details.push('Unable to query historical records');
  }

  return { score: Math.min(score, 15), details };
}

/**
 * Calculate the documentation completeness risk score (0-10 points)
 */
function calculateDocumentationRisk(payload) {
  let score = 0;
  const details = [];

  const requiredFields = ['prNumber', 'department', 'requestBy', 'lineItems'];
  const missingFields = requiredFields.filter(field => !payload[field]);

  if (missingFields.length > 0) {
    score += missingFields.length * 3;
    details.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (payload.lineItems && payload.lineItems.length > 0) {
    const incompleteItems = payload.lineItems.filter(item =>
      !item.itemName || !item.quantity || !item.unitOfMeasurement
    );

    if (incompleteItems.length > 0) {
      score += 4;
      details.push(`${incompleteItems.length} item(s) with incomplete information`);
    }
  }

  return { score: Math.min(score, 10), details };
}

/**
 * Calculate the urgency risk score (0-10 points)
 */
function calculateUrgencyRisk(urgency) {
  let score = 0;
  const details = [];

  if (urgency === 'critical') {
    score = 10;
    details.push('🔴 Critical purchase — may bypass the normal approval process');
  } else if (urgency === 'urgent') {
    score = 6;
    details.push('🟡 Urgent purchase — requires a quick decision');
  } else {
    details.push('✅ Standard procurement process');
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
- Financial: RM 15,000 (85% of monthly IT budget)
- Compliance: Minor - missing delivery timeline
- Operational: Low - standard equipment

📋 POLICY COMPLIANCE:
- Budget Status: Within allocation (85% utilized)
- Authority Level: Requires Manager approval (amount > RM 10,000)
- Documentation: 90% complete (delivery date needed)
- Policy Violations: None

📊 HISTORICAL CONTEXT:
- 12 similar laptop requests in past 6 months
- Average price: RM 4,200 (this request: RM 4,500, +7%)
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
 * Focuses on purchase request evaluation, risk analysis, and policy compliance checks
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

        // Look up the purchase request
        const request = await prisma.purchaseRequestRecord.findUnique({
          where: { localId: requestId },
        });

        if (!request) {
          return { success: false, error: 'Purchase request not found' };
        }

        const payload = request.payload;

        // Calculate the total amount
        const totalAmount = (payload.lineItems || []).reduce((sum, item) => {
          return sum + (item.unitPrice * item.quantity || 0);
        }, 0);

        // Get the department's historical spending
        const deptRequests = await prisma.purchaseRequestRecord.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // past 30 days
            },
          },
        });

        const deptSpending = deptRequests
          .filter(r => r.payload.department === payload.department)
          .reduce((sum, r) => {
            return sum + (r.payload.lineItems || []).reduce((s, item) =>
              s + (item.unitPrice * item.quantity || 0), 0);
          }, 0);

        // Risk assessment
        const budgetUtilization = totalAmount / (deptSpending + totalAmount) * 100;
        let financialRisk = 'low';
        if (budgetUtilization > 80) financialRisk = 'high';
        else if (budgetUtilization > 50) financialRisk = 'medium';

        let complianceRisk = 'low';
        if (totalAmount > 50000) complianceRisk = 'high';
        else if (totalAmount > 20000) complianceRisk = 'medium';

        const operationalRisk = 'low'; // simplified assessment

        // Overall risk
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

        // Get the date range
        const dateRange = getDateRangeForPeriod(period);

        // Query all orders for this department during the period
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

        // Calculate the actual spending
        const totalSpent = orders.reduce((sum, order) => {
          return sum + (order.payload.items || []).reduce((s, item) =>
            s + parseFloat(item.totalPrice || 0), 0);
        }, 0);

        // Dynamic budget configuration (a real project should fetch this from a Budget table)
        // An assumed budget value is used here
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

        // Forecast when the budget will be depleted
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

        // Dynamic recommendation generation
        let status, recommendation, severity;
        if (utilizationAfter > 100) {
          status = '🔴 Over budget';
          severity = 'critical';
          recommendation = '❌ Cannot approve — insufficient budget. Request additional budget or postpone the purchase.';
        } else if (utilizationAfter > 95) {
          status = '🔴 Serious over-budget risk';
          severity = 'high';
          recommendation = '⚠️ Strongly recommend postponing this purchase — budget is nearly depleted. Consider:\n1. Postpone to the next period\n2. Reduce the purchase quantity\n3. Request an emergency budget increase';
        } else if (utilizationAfter > 85) {
          status = '🟡 Approaching budget limit';
          severity = 'medium';
          recommendation = '⚠️ Can be approved, but with caution:\n1. This is the last major purchase opportunity this period\n2. Only small purchases can be approved afterward\n3. Recommend monitoring the remaining budget';
        } else if (utilizationAfter > 70) {
          status = '🟢 Budget sufficient but worth noting';
          severity = 'low';
          recommendation = '✅ Budget status is healthy, can be approved. Recommend continuing to monitor spending trends.';
        } else {
          status = '🟢 Budget healthy';
          severity = 'none';
          recommendation = '✅ Budget is sufficient, no concerns. Spending is healthy, can be approved normally.';
        }

        // Compare against the same period historically
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
              trend: changePercent > 10 ? '📈 Increasing' : changePercent < -10 ? '📉 Decreasing' : '➡️ Flat',
            };
          } catch (error) {
            // Ignore historical comparison errors
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
            ? ['⚠️ Budget utilization exceeds 90%', '❌ Further purchases will be restricted', '📋 Recommend planning next period\'s budget']
            : utilizationAfter > 70
            ? ['⚠️ Budget utilization exceeds 70%', '📊 Recommend close monitoring']
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

        // Multi-dimensional risk assessment
        const factors = {
          // 1. Financial risk (0-25 points)
          financial: await calculateFinancialRisk(totalAmount, payload.department),

          // 2. Supplier risk (0-20 points)
          supplier: await calculateSupplierRisk(payload.lineItems),

          // 3. Compliance risk (0-20 points)
          compliance: calculateComplianceRisk(payload, totalAmount),

          // 4. Historical risk (0-15 points)
          historical: await calculateHistoricalRisk(payload.createdByUserId, payload.department),

          // 5. Documentation completeness risk (0-10 points)
          documentation: calculateDocumentationRisk(payload),

          // 6. Urgency risk (0-10 points)
          urgency: calculateUrgencyRisk(payload.urgency),
        };

        // Calculate the total score (0-100)
        const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0);

        // Determine the risk level
        let riskLevel, indicator, recommendation;
        if (totalScore < 30) {
          riskLevel = 'low';
          indicator = '🟢';
          recommendation = '✅ Low risk — recommend fast approval';
        } else if (totalScore < 60) {
          riskLevel = 'medium';
          indicator = '🟡';
          recommendation = '⚠️ Medium risk — recommend approval after detailed review';
        } else {
          riskLevel = 'high';
          indicator = '🔴';
          recommendation = '🔴 High risk — recommend rejection or request additional information';
        }

        // Auto-approval recommendation
        const autoApprove = totalScore < 20 && totalAmount < 5000;

        // Generate the detailed report
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
            ? ['✅ Meets auto-approval criteria', 'No manual review needed', 'System can process automatically']
            : totalScore < 40
            ? ['📋 Submit to department manager for approval', 'Expected completion within 1 business day']
            : totalScore < 70
            ? ['⚠️ Submit to executive for approval', 'Detailed review required', 'Expected 2-3 business days']
            : ['🔴 Additional information required', 'Contact the requester to clarify details', 'Re-evaluate after resubmission'],

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

        // Decision logic
        let decision = 'APPROVE';
        let conditions = [];
        let reasoning = [];

        if (totalAmount > 50000) {
          decision = 'REVIEW';
          conditions.push('Requires executive approval (amount > RM 50,000)');
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
