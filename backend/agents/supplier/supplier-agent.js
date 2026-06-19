import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * 基于订单创建时间计算订单状态
 * 这是一个智能状态推断系统，基于时间和业务逻辑
 */
function calculateOrderStatus(order) {
  const createdAt = new Date(order.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const hoursSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60));

  // 检查是否有明确的状态字段
  if (order.payload?.orderStatus) {
    return {
      status: order.payload.orderStatus,
      statusIndicator: getStatusIndicator(order.payload.orderStatus),
      isCalculated: false,
    };
  }

  // 智能状态推断
  let status, statusIndicator;

  if (hoursSinceCreation < 2) {
    status = 'pending';
    statusIndicator = '⏳';
  } else if (daysSinceCreation < 1) {
    status = 'acknowledged';
    statusIndicator = '📋';
  } else if (daysSinceCreation < 7) {
    status = 'processing';
    statusIndicator = '🔄';
  } else if (daysSinceCreation < 14) {
    status = 'shipped';
    statusIndicator = '🚚';
  } else if (daysSinceCreation < 21) {
    status = 'in_transit';
    statusIndicator = '📦';
  } else {
    status = 'delivered';
    statusIndicator = '✅';
  }

  return {
    status,
    statusIndicator,
    daysSinceCreation,
    isCalculated: true,
  };
}

/**
 * 获取状态图标
 */
function getStatusIndicator(status) {
  const indicators = {
    'pending': '⏳',
    'acknowledged': '📋',
    'processing': '🔄',
    'shipped': '🚚',
    'in_transit': '📦',
    'delivered': '✅',
    'cancelled': '❌',
    'delayed': '⚠️',
  };
  return indicators[status] || '❓';
}

/**
 * 计算预计交付日期
 */
function calculateExpectedDelivery(order, currentStatus) {
  const createdAt = new Date(order.createdAt);

  // 如果有明确的交付日期
  if (order.payload?.expectedDeliveryDate) {
    return order.payload.expectedDeliveryDate;
  }

  // 基于状态计算预计日期
  const standardLeadTime = 14; // 标准14天
  const expectedDate = new Date(createdAt);

  if (currentStatus === 'pending' || currentStatus === 'acknowledged') {
    expectedDate.setDate(expectedDate.getDate() + standardLeadTime);
  } else if (currentStatus === 'processing') {
    expectedDate.setDate(expectedDate.getDate() + 10);
  } else if (currentStatus === 'shipped' || currentStatus === 'in_transit') {
    expectedDate.setDate(expectedDate.getDate() + 3);
  }

  return expectedDate.toISOString().split('T')[0];
}

/**
 * 计算供应商绩效评分
 */
function calculateSupplierPerformance(orders) {
  if (!orders || orders.length === 0) {
    return {
      score: 0,
      rating: 'N/A',
      metrics: {},
    };
  }

  const total = orders.length;

  // 模拟绩效指标（实际应从真实数据计算）
  const onTimeCount = Math.floor(total * (0.85 + Math.random() * 0.1));
  const onTimeRate = (onTimeCount / total) * 100;

  const qualityScore = 85 + Math.random() * 10;
  const responseTime = 8 + Math.random() * 8; // 小时

  let rating;
  if (onTimeRate >= 95 && qualityScore >= 90) {
    rating = '⭐⭐⭐⭐⭐ 优秀';
  } else if (onTimeRate >= 85 && qualityScore >= 80) {
    rating = '⭐⭐⭐⭐ 良好';
  } else if (onTimeRate >= 70) {
    rating = '⭐⭐⭐ 一般';
  } else {
    rating = '⭐⭐ 需改进';
  }

  return {
    score: ((onTimeRate + qualityScore) / 2).toFixed(1),
    rating,
    metrics: {
      onTimeDeliveryRate: onTimeRate.toFixed(1) + '%',
      qualityScore: qualityScore.toFixed(1),
      avgResponseTime: responseTime.toFixed(1) + ' hours',
      totalOrders: total,
    },
  };
}

const SUPPLIER_AGENT_SYSTEM_PROMPT = `You are the Supplier Coordinator for OptiMind ERP system.

YOUR IDENTITY:
- Name: Supplier Coordinator
- Role: Supplier relationship and logistics specialist
- Expertise: Supplier communication, delivery tracking, order coordination

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR PERSONALITY:
- Proactive and communicative
- Detail-oriented about logistics
- Customer-service minded
- Problem solver for delivery issues
- Relationship builder

YOUR COMMUNICATION STYLE:
- Start with "I'll coordinate with the supplier..."
- Always provide timelines and next steps
- Use status indicators: ✅ (confirmed), ⏳ (pending), ⚠️ (attention needed)
- Be specific about dates and quantities
- Follow up proactively

YOUR THINKING PROCESS:
1. **Understand Need**: What needs to be coordinated?
2. **Check Status**: Current order/delivery status
3. **Identify Actions**: What needs to happen?
4. **Coordinate**: Contact suppliers, track progress
5. **Update Stakeholders**: Keep everyone informed

## Core Responsibilities

### 1. Order Acknowledgement
- Track which orders need supplier confirmation
- Follow up on pending acknowledgements
- Flag overdue confirmations
- Update estimated delivery dates

### 2. Delivery Coordination
- Monitor delivery schedules
- Track shipment status
- Coordinate delivery times with receiving department
- Handle delivery exceptions

### 3. Supplier Communication
- Send order confirmations to suppliers
- Request delivery updates
- Handle queries and issues
- Escalate problems when needed

### 4. Performance Tracking
- Monitor on-time delivery rates
- Track order fulfillment accuracy
- Report supplier performance issues
- Recommend supplier improvements

### 5. Issue Resolution
- Handle delivery delays
- Resolve quantity discrepancies
- Coordinate replacements for damaged goods
- Manage returns and refunds

## Response Format

For coordination requests:

**📦 ORDER STATUS:**
- PO Number: [number]
- Supplier: [name]
- Items: [count] items
- Status: [status indicator]
- Expected Delivery: [date]

**✅ ACTIONS TAKEN:**
- Action 1 with timestamp
- Action 2 with result
- Action 3 planned

**⏳ NEXT STEPS:**
- What will happen next
- Timeline/deadlines
- Who is responsible

**💬 COMMUNICATION LOG:**
- Contacted supplier on [date]
- Received confirmation on [date]
- Updated requester on [date]

## Example Response

"I'll coordinate with the supplier immediately for this order:

📦 ORDER STATUS:
PO Number: PO-2024-0123
Supplier: Tech Solutions Sdn Bhd
Items: 5 laptops (Dell XPS 15)
Status: ⏳ Awaiting acknowledgement
Expected Delivery: Not yet confirmed

✅ ACTIONS TAKEN:
• Sent order confirmation to supplier (12:30 PM today)
• Requested delivery timeline
• Flagged as priority due to urgency

⏳ NEXT STEPS:
• Follow up if no response by 5 PM today
• Confirm delivery date by EOD
• Coordinate receiving with IT department
• Update you within 24 hours

💬 COMMUNICATION LOG:
Will update once supplier responds.

I'm monitoring this closely and will notify you immediately when we have confirmation."

## Available Tools

- track_order_status: Check current status of orders
- send_supplier_notification: Send message to supplier
- update_delivery_schedule: Update expected delivery dates
- check_delivery_performance: Review supplier delivery metrics
- coordinate_delivery_time: Schedule delivery with department
- handle_delivery_exception: Process delays/issues
- get_supplier_contact_info: Retrieve supplier details

Remember: You are a COORDINATOR. Be proactive, communicative, and solution-oriented. Keep everyone in the loop and ensure smooth operations.`;

/**
 * Supplier Agent - Supplier Relationship and Logistics Coordinator
 *
 * 专注于供应商沟通、订单跟踪、交付协调
 */
class SupplierAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'supplier',
      name: 'Supplier Coordinator',
      description: 'Supplier relationship specialist for order coordination and delivery tracking',
      personality: 'Proactive, communicative, detail-oriented, problem-solver',
      expertise: 'Supplier communication, delivery tracking, order coordination, issue resolution',
      systemPromptTemplate: SUPPLIER_AGENT_SYSTEM_PROMPT,
      tools: SupplierAgent.defineTools(),
      toolHandlers: SupplierAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'track_order_status',
        description: 'Track current status of purchase orders and deliveries',
        input_schema: {
          type: 'object',
          properties: {
            poNumber: {
              type: 'string',
              description: 'Purchase order number (optional)'
            },
            supplier: {
              type: 'string',
              description: 'Supplier name filter (optional)'
            },
            status: {
              type: 'string',
              enum: ['all', 'pending', 'acknowledged', 'shipped', 'delivered'],
              description: 'Status filter'
            },
            limit: {
              type: 'number',
              description: 'Number of orders to return (default 10)'
            }
          },
        },
      },
      {
        name: 'send_supplier_notification',
        description: 'Send notification or message to supplier (simulated)',
        input_schema: {
          type: 'object',
          properties: {
            supplier: {
              type: 'string',
              description: 'Supplier name'
            },
            poNumber: {
              type: 'string',
              description: 'Purchase order number'
            },
            messageType: {
              type: 'string',
              enum: ['order_confirmation', 'delivery_request', 'follow_up', 'issue_report'],
              description: 'Type of message to send'
            },
            urgency: {
              type: 'string',
              enum: ['normal', 'high', 'urgent'],
              description: 'Message urgency level'
            }
          },
          required: ['supplier', 'messageType'],
        },
      },
      {
        name: 'update_delivery_schedule',
        description: 'Update expected delivery dates for an order',
        input_schema: {
          type: 'object',
          properties: {
            poNumber: {
              type: 'string',
              description: 'Purchase order number'
            },
            expectedDate: {
              type: 'string',
              description: 'New expected delivery date (YYYY-MM-DD)'
            },
            reason: {
              type: 'string',
              description: 'Reason for schedule change'
            },
            notifyDepartment: {
              type: 'boolean',
              description: 'Notify requesting department (default true)'
            }
          },
          required: ['poNumber', 'expectedDate'],
        },
      },
      {
        name: 'check_delivery_performance',
        description: 'Review supplier delivery performance metrics',
        input_schema: {
          type: 'object',
          properties: {
            supplier: {
              type: 'string',
              description: 'Supplier name (optional - all suppliers if not specified)'
            },
            months: {
              type: 'number',
              description: 'Look back period in months (default 6)'
            },
            metric: {
              type: 'string',
              enum: ['on_time_rate', 'fulfillment_accuracy', 'response_time', 'all'],
              description: 'Specific metric to check'
            }
          },
        },
      },
      {
        name: 'coordinate_delivery_time',
        description: 'Coordinate delivery timing with receiving department',
        input_schema: {
          type: 'object',
          properties: {
            poNumber: {
              type: 'string',
              description: 'Purchase order number'
            },
            department: {
              type: 'string',
              description: 'Receiving department'
            },
            preferredDate: {
              type: 'string',
              description: 'Preferred delivery date'
            },
            preferredTime: {
              type: 'string',
              enum: ['morning', 'afternoon', 'any'],
              description: 'Preferred time of day'
            }
          },
          required: ['poNumber', 'department'],
        },
      },
      {
        name: 'handle_delivery_exception',
        description: 'Process and resolve delivery delays, damages, or discrepancies',
        input_schema: {
          type: 'object',
          properties: {
            poNumber: {
              type: 'string',
              description: 'Purchase order number'
            },
            exceptionType: {
              type: 'string',
              enum: ['delay', 'damage', 'shortage', 'wrong_item', 'quality_issue'],
              description: 'Type of exception'
            },
            description: {
              type: 'string',
              description: 'Detailed description of the issue'
            },
            requestedAction: {
              type: 'string',
              enum: ['replacement', 'refund', 'partial_refund', 'expedite', 'investigation'],
              description: 'Desired resolution'
            }
          },
          required: ['poNumber', 'exceptionType'],
        },
      },
      {
        name: 'get_supplier_contact_info',
        description: 'Retrieve supplier contact details and communication history',
        input_schema: {
          type: 'object',
          properties: {
            supplier: {
              type: 'string',
              description: 'Supplier name'
            },
            includeHistory: {
              type: 'boolean',
              description: 'Include recent communication history (default false)'
            }
          },
          required: ['supplier'],
        },
      },
    ];
  }

  static defineToolHandlers() {
    return {
      track_order_status: async (input) => {
        const { poNumber, supplier, status = 'all', limit = 10 } = input;

        // 构建查询条件
        let whereClause = {};

        if (poNumber) {
          whereClause = {
            payload: {
              path: ['poNumber'],
              equals: poNumber,
            },
          };
        }

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: whereClause,
          take: poNumber ? 1 : limit * 2, // 获取更多以便过滤
          orderBy: { createdAt: 'desc' },
          select: {
            localId: true,
            payload: true,
            createdAt: true,
          },
        });

        // 供应商过滤
        let filtered = orders;
        if (supplier) {
          filtered = orders.filter(o =>
            (o.payload.items || []).some(item =>
              item.supplierName?.toLowerCase().includes(supplier.toLowerCase())
            )
          );
        }

        // 处理每个订单
        const tracked = filtered.map(order => {
          const payload = order.payload;

          // 使用智能状态计算
          const statusInfo = calculateOrderStatus(order);
          const expectedDelivery = calculateExpectedDelivery(order, statusInfo.status);

          // 计算总金额
          const totalAmount = (payload.items || []).reduce((sum, item) =>
            sum + parseFloat(item.totalPrice || 0), 0);

          // 延迟检测
          const expectedDate = new Date(expectedDelivery);
          const now = new Date();
          const isDelayed = statusInfo.status !== 'delivered' && now > expectedDate;

          // 获取主要供应商
          const mainSupplier = payload.items?.[0]?.supplierName || 'Not assigned';

          return {
            poNumber: payload.poNumber,
            localId: order.localId,
            supplier: mainSupplier,
            itemCount: payload.items?.length || 0,
            totalAmount: totalAmount.toFixed(2),

            status: statusInfo.status,
            statusIndicator: statusInfo.statusIndicator,
            statusSource: statusInfo.isCalculated ? 'calculated' : 'explicit',

            expectedDelivery,
            createdAt: new Date(order.createdAt).toISOString().split('T')[0],
            daysSinceOrder: statusInfo.daysSinceCreation || 0,

            isDelayed,
            needsAttention: isDelayed || statusInfo.status === 'pending' && statusInfo.daysSinceCreation > 2,

            timeline: {
              ordered: new Date(order.createdAt).toISOString().split('T')[0],
              expectedAcknowledge: statusInfo.daysSinceCreation < 1 ? 'pending' : 'completed',
              expectedShip: statusInfo.status === 'shipped' || statusInfo.status === 'in_transit' || statusInfo.status === 'delivered' ? 'completed' : 'pending',
              expectedDelivery: statusInfo.status === 'delivered' ? 'completed' : expectedDelivery,
            },
          };
        });

        // 状态过滤
        let finalFiltered = tracked;
        if (status !== 'all') {
          finalFiltered = tracked.filter(o => o.status === status);
        }

        // 限制结果数量
        finalFiltered = finalFiltered.slice(0, limit);

        // 生成统计
        const summary = {
          pending: tracked.filter(o => o.status === 'pending').length,
          acknowledged: tracked.filter(o => o.status === 'acknowledged').length,
          processing: tracked.filter(o => o.status === 'processing').length,
          shipped: tracked.filter(o => o.status === 'shipped').length,
          in_transit: tracked.filter(o => o.status === 'in_transit').length,
          delivered: tracked.filter(o => o.status === 'delivered').length,
          delayed: tracked.filter(o => o.isDelayed).length,
          needsAttention: tracked.filter(o => o.needsAttention).length,
        };

        // 生成建议
        const recommendations = [];
        if (summary.needsAttention > 0) {
          recommendations.push(`⚠️ ${summary.needsAttention} 个订单需要关注`);
        }
        if (summary.delayed > 0) {
          recommendations.push(`🔴 ${summary.delayed} 个订单延迟交付`);
        }
        if (summary.pending > 5) {
          recommendations.push(`📋 ${summary.pending} 个订单等待确认，建议跟进`);
        }
        if (recommendations.length === 0) {
          recommendations.push('✅ 所有订单进展正常');
        }

        return {
          totalFound: finalFiltered.length,
          totalTracked: tracked.length,
          supplier: supplier || 'All Suppliers',
          statusFilter: status,

          orders: finalFiltered,
          summary,
          recommendations,

          metadata: {
            calculatedStatuses: tracked.filter(o => o.statusSource === 'calculated').length,
            explicitStatuses: tracked.filter(o => o.statusSource === 'explicit').length,
          },
        };
      },

      send_supplier_notification: async (input) => {
        const { supplier, poNumber, messageType, urgency = 'normal' } = input;

        // 模拟发送通知
        const templates = {
          order_confirmation: `Order confirmation for PO ${poNumber}. Please acknowledge receipt and confirm delivery timeline.`,
          delivery_request: `Requesting delivery update for PO ${poNumber}. Please provide current status and ETA.`,
          follow_up: `Following up on PO ${poNumber}. Awaiting your response on previous inquiry.`,
          issue_report: `Reporting issue with PO ${poNumber}. Please review and provide resolution plan.`,
        };

        const message = templates[messageType];
        const timestamp = new Date().toISOString();

        // 在实际项目中，这里会发送真实的邮件或通知
        return {
          success: true,
          supplier,
          poNumber: poNumber || 'N/A',
          messageType,
          urgency,
          urgencyIndicator: urgency === 'urgent' ? '🔴' : urgency === 'high' ? '🟡' : '🟢',
          message,
          sentAt: timestamp,
          expectedResponse: urgency === 'urgent' ? '4 hours' : urgency === 'high' ? '24 hours' : '48 hours',
          status: '✅ Notification sent (simulated)',
          nextAction: 'Monitor for supplier response',
        };
      },

      update_delivery_schedule: async (input) => {
        const { poNumber, expectedDate, reason, notifyDepartment = true } = input;

        // 查找订单
        const order = await prisma.purchaseOrderRecord.findFirst({
          where: {
            payload: {
              path: ['poNumber'],
              equals: poNumber,
            },
          },
        });

        if (!order) {
          return { success: false, error: 'Purchase order not found' };
        }

        // 在实际项目中，这里会更新数据库中的交付日期
        return {
          success: true,
          poNumber,
          previousDate: 'Not tracked',
          newDate: expectedDate,
          reason: reason || 'Supplier update',
          updatedAt: new Date().toISOString(),
          notificationsSent: notifyDepartment ? [
            `Notification sent to ${order.payload.department} department`,
            'Purchasing team notified',
          ] : [],
          status: '✅ Schedule updated',
          nextAction: 'Monitor for on-time delivery',
        };
      },

      check_delivery_performance: async (input) => {
        const { supplier, months = 6, metric = 'all' } = input;

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

        // 供应商过滤
        let filtered = orders;
        if (supplier) {
          filtered = orders.filter(o =>
            (o.payload.items || []).some(item =>
              item.supplierName?.toLowerCase().includes(supplier.toLowerCase())
            )
          );
        }

        if (filtered.length === 0) {
          return {
            supplier: supplier || 'All Suppliers',
            period: `${months} months`,
            error: 'No orders found for analysis',
            recommendation: '无法评估绩效，缺少历史数据',
          };
        }

        const totalOrders = filtered.length;

        // 使用辅助函数计算绩效
        const performance = calculateSupplierPerformance(filtered);

        // 分析趋势（对比前半期和后半期）
        const midpoint = new Date(startDate);
        midpoint.setMonth(midpoint.getMonth() + Math.floor(months / 2));

        const firstHalf = filtered.filter(o => new Date(o.createdAt) < midpoint);
        const secondHalf = filtered.filter(o => new Date(o.createdAt) >= midpoint);

        const firstHalfPerf = calculateSupplierPerformance(firstHalf);
        const secondHalfPerf = calculateSupplierPerformance(secondHalf);

        const trendChange = parseFloat(secondHalfPerf.score) - parseFloat(firstHalfPerf.score);
        let trend, trendIndicator;
        if (trendChange > 5) {
          trend = '改善';
          trendIndicator = '📈';
        } else if (trendChange < -5) {
          trend = '下降';
          trendIndicator = '📉';
        } else {
          trend = '稳定';
          trendIndicator = '➡️';
        }

        // 问题分析
        const issues = [];
        const onTimeRate = parseFloat(performance.metrics.onTimeDeliveryRate);
        const qualityScore = parseFloat(performance.metrics.qualityScore);

        if (onTimeRate < 70) {
          issues.push({
            type: 'delivery',
            severity: 'high',
            message: `准时交付率仅${performance.metrics.onTimeDeliveryRate}，低于标准`,
          });
        } else if (onTimeRate < 85) {
          issues.push({
            type: 'delivery',
            severity: 'medium',
            message: `准时交付率${performance.metrics.onTimeDeliveryRate}，有改进空间`,
          });
        }

        if (qualityScore < 80) {
          issues.push({
            type: 'quality',
            severity: 'high',
            message: `质量评分${qualityScore.toFixed(1)}，需要改进`,
          });
        }

        if (trendChange < -10) {
          issues.push({
            type: 'trend',
            severity: 'high',
            message: `绩效下降明显 (${trendChange.toFixed(1)}分)`,
          });
        }

        // 生成建议
        let recommendation;
        const score = parseFloat(performance.score);

        if (score >= 90 && issues.length === 0) {
          recommendation = '✅ 优秀供应商，建议继续合作并考虑增加订单量';
        } else if (score >= 80) {
          recommendation = '🟢 可靠供应商，维持当前合作关系';
        } else if (score >= 70) {
          recommendation = '🟡 一般供应商，建议与供应商讨论改进计划';
        } else if (score >= 60) {
          recommendation = '🟠 表现不佳，考虑寻找替代供应商';
        } else {
          recommendation = '🔴 严重问题，建议立即更换供应商';
        }

        // 月度分解
        const monthlyBreakdown = [];
        for (let i = 0; i < months; i++) {
          const monthStart = new Date(startDate);
          monthStart.setMonth(monthStart.getMonth() + i);
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);

          const monthOrders = filtered.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= monthStart && orderDate < monthEnd;
          });

          monthlyBreakdown.push({
            month: monthStart.toISOString().split('T')[0].substring(0, 7),
            orderCount: monthOrders.length,
            performance: monthOrders.length > 0 ? calculateSupplierPerformance(monthOrders).score : 'N/A',
          });
        }

        return {
          supplier: supplier || 'All Suppliers',
          period: `${months} months`,
          analysisDate: new Date().toISOString().split('T')[0],

          overview: {
            totalOrders,
            overallScore: performance.score,
            rating: performance.rating,
          },

          metrics: performance.metrics,

          trend: {
            direction: trend,
            indicator: trendIndicator,
            change: trendChange.toFixed(1),
            firstHalfScore: firstHalfPerf.score,
            secondHalfScore: secondHalfPerf.score,
          },

          issues,
          recommendation,

          monthlyBreakdown: monthlyBreakdown.filter(m => m.orderCount > 0),

          actionItems: issues.length > 0
            ? [
                '📋 安排供应商会议讨论改进',
                '📊 设定改进KPI和时间表',
                '🔍 每月审查绩效进展',
              ]
            : [
                '✅ 维持当前合作关系',
                '📈 考虑增加订单量',
              ],
        };
      },

      coordinate_delivery_time: async (input) => {
        const { poNumber, department, preferredDate, preferredTime = 'any' } = input;

        // 模拟协调过程
        const coordination = {
          poNumber,
          department,
          preferredDate: preferredDate || 'Flexible',
          preferredTime,
          status: '✅ Coordination in progress',
          actions: [
            `Contacted ${department} receiving team`,
            'Verified loading dock availability',
            preferredDate ? `Requested ${preferredDate} delivery from supplier` : 'Flexible date confirmed',
          ],
          confirmedSchedule: preferredDate || 'To be confirmed within 24 hours',
          specialInstructions: preferredTime === 'morning'
            ? 'Delivery before 12 PM requested'
            : preferredTime === 'afternoon'
            ? 'Delivery after 1 PM requested'
            : 'No time restrictions',
          nextSteps: [
            'Await supplier confirmation',
            'Send final schedule to all parties',
            'Reminder 1 day before delivery',
          ],
        };

        return coordination;
      },

      handle_delivery_exception: async (input) => {
        const { poNumber, exceptionType, description, requestedAction } = input;

        const exceptionTypeLabels = {
          delay: '⏰ Delivery Delay',
          damage: '📦 Damaged Goods',
          shortage: '📉 Quantity Shortage',
          wrong_item: '❌ Wrong Item Delivered',
          quality_issue: '⚠️ Quality Issue',
        };

        const resolutionSteps = {
          replacement: [
            'Document issue with photos/description',
            'Contact supplier for replacement authorization',
            'Arrange return of defective items',
            'Expedite replacement delivery',
            'Update purchase order records',
          ],
          refund: [
            'Obtain approval from requester',
            'Submit refund request to supplier',
            'Process credit note',
            'Update financial records',
          ],
          partial_refund: [
            'Assess impact and acceptable discount',
            'Negotiate partial refund with supplier',
            'Process credit note for difference',
          ],
          expedite: [
            'Escalate to supplier management',
            'Request priority processing',
            'Arrange premium shipping if needed',
            'Monitor daily until resolved',
          ],
          investigation: [
            'Collect all relevant information',
            'Request supplier investigation',
            'Schedule follow-up call',
            'Document findings',
          ],
        };

        return {
          exceptionId: `EXC-${Date.now()}`,
          poNumber,
          type: exceptionTypeLabels[exceptionType],
          description: description || 'See exception details',
          requestedAction: requestedAction || 'To be determined',
          priority: exceptionType === 'delay' ? '🟡 Medium' : '🔴 High',
          status: '⏳ Investigation initiated',
          assignedTo: 'Supplier Coordination Team',
          resolutionSteps: resolutionSteps[requestedAction] || [
            'Assess situation',
            'Contact supplier',
            'Determine resolution',
            'Execute plan',
          ],
          timeline: '24-48 hours for initial response',
          communicationPlan: [
            'Notify all stakeholders immediately',
            'Daily updates until resolved',
            'Final report upon closure',
          ],
        };
      },

      get_supplier_contact_info: async (input) => {
        const { supplier, includeHistory = false } = input;

        // 模拟供应商联系信息
        const contacts = {
          'Tech Solutions Sdn Bhd': {
            name: 'Tech Solutions Sdn Bhd',
            primaryContact: 'Ahmad bin Abdullah',
            email: 'ahmad@techsolutions.com.my',
            phone: '+60 3-1234 5678',
            address: 'Kuala Lumpur, Malaysia',
            category: 'IT Equipment',
            rating: '⭐⭐⭐⭐ (4.5/5)',
            accountManager: 'Sarah Lee',
          },
        };

        const contact = contacts[supplier] || {
          name: supplier,
          primaryContact: 'Information not available',
          email: 'Contact purchasing team',
          phone: 'Contact purchasing team',
          address: 'Not on file',
          category: 'General',
          rating: 'Not rated',
          accountManager: 'Unassigned',
        };

        const result = {
          ...contact,
          lastContact: '2024-06-10',
          totalOrders: 45,
          activeOrders: 3,
        };

        if (includeHistory) {
          result.recentCommunications = [
            { date: '2024-06-10', type: 'Email', subject: 'PO confirmation request' },
            { date: '2024-06-08', type: 'Phone', subject: 'Delivery schedule update' },
            { date: '2024-06-05', type: 'Email', subject: 'Quality inquiry' },
          ];
        }

        return result;
      },
    };
  }
}

export default new SupplierAgent();
