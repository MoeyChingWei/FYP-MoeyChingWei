import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { generatePRNumber } from '../../utils/pr-number-generator.js';

/**
 * Calculate standard deviation
 */
function calculateStdDev(numbers) {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

/**
 * Calculate linear regression
 */
function calculateLinearRegression(data) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0 };

  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
  const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

const PURCHASE_AGENT_SYSTEM_PROMPT = `You are the Procurement Specialist for OptiMind ERP system.

YOUR IDENTITY:
- Name: Purchase Expert
- Role: Professional procurement advisor
- Expertise: Purchase requests, supplier management, cost optimization

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR PERSONALITY:
- Professional and detail-oriented
- Cost-conscious and analytical
- Proactive in identifying issues
- Always thinking about optimization

YOUR COMMUNICATION STYLE:
- Start responses with "As a procurement specialist, I..."
- Always provide cost-saving suggestions when relevant
- Use professional procurement terminology
- Be data-driven in recommendations
- Format important numbers clearly (e.g., "Total: MYR 15,000")

CRITICAL FORMATTING RULES - MUST FOLLOW:

When get_purchase_requests tool returns data, you MUST format the response using this EXACT structure:

1. FIRST: Show statistics in a card layout:

╔═════════════╦═════════════╦═════════════╦═════════════╗
║  Total PR   ║   Pending   ║  Submitted  ║  Approved   ║
║     {N}     ║     {N}     ║     {N}     ║     {N}     ║
╚═════════════╩═════════════╩═════════════╩═════════════╝

2. THEN: Show recent requests in a table:

┏━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┓
┃   PR No.     ┃  Status  ┃         Items          ┃    Date     ┃
┣━━━━━━━━━━━━━━╋━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━┫
┃ PR-20260615  ┃ 🔴 Pending ┃ Purchase 1 (100 boxes) ┃  15 Jun     ┃
┃ PR-20260611  ┃ 🔴 Pending ┃ Testing Chatbot (6 bo) ┃  11 Jun     ┃
┃ PR-20260507  ┃ 🟢 Approved┃ FYP Testing (20 pcs)   ┃  07 May     ┃
┗━━━━━━━━━━━━━━┻━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━┛

Status emojis: 🔴 Pending | 🟡 Submitted | 🟢 Approved | ⚫ Rejected

NEVER use plain text lists like:
| 1 | **PR-20260615** | 🔴 Pending | ... |  ❌ WRONG FORMAT

ALWAYS use the box-drawing table format shown above. This is NON-NEGOTIABLE.

YOUR EXPERTISE AREAS:
1. **Purchase Request Creation**
   - Help users create detailed purchase requests
   - Suggest optimal quantities based on usage patterns
   - Recommend appropriate suppliers
   - Validate pricing against historical data

2. **Supplier Management**
   - Recommend suppliers based on category and history
   - Evaluate supplier performance
   - Track delivery reliability
   - Suggest alternative suppliers

3. **Cost Analysis**
   - Analyze price trends
   - Identify cost-saving opportunities
   - Flag unusual pricing
   - Compare prices across suppliers

4. **Inventory Optimization**
   - Suggest bulk ordering when cost-effective
   - Identify overstocking/understocking risks
   - Recommend reorder points

## Creating Purchase Requests

Guide users step-by-step through purchase request creation:

1. **Item Details**: Name, category, quantity, unit
2. **Supplier Recommendation**: Suggest best suppliers based on:
   - Category match
   - Historical performance
   - Price competitiveness
   - Delivery reliability
3. **Price Analysis**: Show historical prices if available
4. **Optimization Suggestions**: Bulk discounts, alternatives, bundling
5. **Compliance Check**: Verify against approval thresholds

After collecting all items, call create_purchase_request_optimized tool.

## Proactive Advice

Always provide additional insights:
- "💡 TIP: Ordering 100 units instead of 50 could save 15% due to bulk discount"
- "⚠️ ALERT: This item's price is 20% higher than last month's average"
- "✅ GOOD CHOICE: This supplier has 98% on-time delivery rate"

## Available Tools

- create_purchase_request_optimized: Create optimized purchase request
- recommend_suppliers: Get supplier recommendations for category
- analyze_price_history: Get historical price data for items
- check_inventory_status: Check current inventory levels
- suggest_alternatives: Suggest alternative items/suppliers
- calculate_bulk_savings: Calculate potential bulk order savings

Remember: You are a procurement EXPERT. Be confident, analytical, and always add value beyond just creating requests.`;

/**
 * Purchase Agent - Procurement Specialist
 *
 * Focused on procurement process optimization, supplier management, and cost analysis
 */
class PurchaseAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'purchase',
      name: 'Purchase Expert',
      description: 'Professional procurement advisor for purchase requests and supplier management',
      personality: 'Analytical, cost-conscious, and optimization-focused',
      expertise: 'Purchase requests, supplier evaluation, cost optimization, inventory management',
      systemPromptTemplate: PURCHASE_AGENT_SYSTEM_PROMPT,
      tools: PurchaseAgent.defineTools(),
      toolHandlers: PurchaseAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'create_purchase_request_optimized',
        description: 'Create an optimized purchase request with supplier recommendations and cost analysis',
        input_schema: {
          type: 'object',
          properties: {
            lineItems: {
              type: 'array',
              description: 'List of items to purchase',
              items: {
                type: 'object',
                properties: {
                  itemName: { type: 'string' },
                  itemCategory: { type: 'string' },
                  quantity: { type: 'number' },
                  unitOfMeasurement: { type: 'string' },
                  itemDescription: { type: 'string' },
                  preferredSupplier: { type: 'string', description: 'Optional preferred supplier name' },
                  estimatedUnitPrice: { type: 'number', description: 'Optional estimated price' },
                },
                required: ['itemName', 'itemCategory', 'quantity', 'unitOfMeasurement', 'itemDescription']
              }
            },
            urgency: {
              type: 'string',
              enum: ['normal', 'urgent', 'critical'],
              description: 'Request urgency level'
            },
            notes: {
              type: 'string',
              description: 'Additional notes from procurement specialist'
            }
          },
          required: ['lineItems'],
        },
      },
      {
        name: 'recommend_suppliers',
        description: 'Recommend suppliers based on item category and historical performance',
        input_schema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Item category'
            },
            itemName: {
              type: 'string',
              description: 'Specific item name (optional)'
            },
            limit: {
              type: 'number',
              description: 'Number of recommendations (default 3)'
            }
          },
          required: ['category'],
        },
      },
      {
        name: 'analyze_price_history',
        description: 'Analyze historical prices for an item to detect trends and anomalies',
        input_schema: {
          type: 'object',
          properties: {
            itemName: {
              type: 'string',
              description: 'Item name to analyze'
            },
            category: {
              type: 'string',
              description: 'Item category'
            },
            months: {
              type: 'number',
              description: 'Number of months to analyze (default 6)'
            }
          },
          required: ['itemName', 'category'],
        },
      },
      {
        name: 'check_inventory_status',
        description: 'Check current inventory levels and usage patterns',
        input_schema: {
          type: 'object',
          properties: {
            itemName: {
              type: 'string',
              description: 'Item name'
            },
            department: {
              type: 'string',
              description: 'Department filter (optional)'
            }
          },
          required: ['itemName'],
        },
      },
      {
        name: 'calculate_bulk_savings',
        description: 'Calculate potential savings from bulk ordering',
        input_schema: {
          type: 'object',
          properties: {
            itemName: { type: 'string' },
            currentQuantity: { type: 'number' },
            currentPrice: { type: 'number' },
            bulkQuantity: { type: 'number' },
            bulkPrice: { type: 'number' },
          },
          required: ['itemName', 'currentQuantity', 'currentPrice', 'bulkQuantity', 'bulkPrice'],
        },
      },
      {
        name: 'get_purchase_requests',
        description: 'Get purchase request list with detailed analysis',
        input_schema: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            limit: { type: 'number' },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED', 'ALL'],
              description: 'Filter by status'
            }
          },
          required: ['userId'],
        },
      },
    ];
  }

  static defineToolHandlers() {
    return {
      create_purchase_request_optimized: async (input) => {
        const { lineItems, urgency = 'normal', notes = '', userId, user } = input;

        if (!lineItems || lineItems.length === 0) {
          return { success: false, error: 'At least one item required' };
        }

        // Generate IDs
        const localId = uuidv4();
        const prNumber = generatePRNumber();
        const today = new Date().toISOString().split('T')[0];

        // Build line items
        const formattedLineItems = lineItems.map(item => ({
          tempId: uuidv4(),
          itemName: item.itemName,
          itemCategory: item.itemCategory,
          quantity: item.quantity,
          unitOfMeasurement: item.unitOfMeasurement,
          itemDescription: item.itemDescription,
          unitPrice: item.estimatedUnitPrice || 0,
          supplierId: null,
          supplierName: item.preferredSupplier || null,
          supplierEmail: null,
        }));

        // Build payload with procurement notes
        const payload = {
          localId,
          status: 'PENDING',
          prNumber,
          requestBy: user.name || 'Unknown',
          department: user.department || 'Unknown',
          requestDate: today,
          createdByEmail: user.email,
          createdByUserId: userId,
          currency: 'MYR',
          lineItems: formattedLineItems,
          urgency,
          procurementNotes: notes,
          createdBy: 'Purchase Agent',
        };

        // Save to database
        try {
          await prisma.purchaseRequestRecord.create({
            data: { localId, payload },
          });

          return {
            success: true,
            prNumber,
            status: 'PENDING',
            itemCount: lineItems.length,
            department: user.department,
            urgency,
            message: '✅ Optimized purchase request created successfully',
          };
        } catch (error) {
          return { success: false, error: 'Failed to create purchase request' };
        }
      },

      recommend_suppliers: async (input) => {
        const { category, itemName, limit = 3 } = input;

        // Get all related orders (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: {
            createdAt: {
              gte: sixMonthsAgo,
            },
          },
          orderBy: { createdAt: 'desc' },
          select: {
            payload: true,
            createdAt: true,
          },
        });

        // Collect supplier statistics
        const supplierStats = {};
        const now = Date.now();

        orders.forEach(order => {
          if (order.payload?.items) {
            order.payload.items.forEach(item => {
              if (item.itemCategory === category) {
                const supplier = item.supplierName || 'Unknown';
                if (supplier === 'Unknown') return;

                if (!supplierStats[supplier]) {
                  supplierStats[supplier] = {
                    name: supplier,
                    totalOrders: 0,
                    recentOrders: 0, // last 3 months
                    categories: new Set(),
                    totalValue: 0,
                    prices: [],
                    lastOrderDate: null,
                  };
                }

                supplierStats[supplier].totalOrders++;
                supplierStats[supplier].categories.add(item.itemCategory);
                supplierStats[supplier].totalValue += parseFloat(item.totalPrice || 0);
                supplierStats[supplier].prices.push(parseFloat(item.unitPrice || 0));

                // Record the most recent order date
                const orderDate = new Date(order.createdAt);
                if (!supplierStats[supplier].lastOrderDate || orderDate > supplierStats[supplier].lastOrderDate) {
                  supplierStats[supplier].lastOrderDate = orderDate;
                }

                // Count orders from the last 3 months
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                if (orderDate >= threeMonthsAgo) {
                  supplierStats[supplier].recentOrders++;
                }
              }
            });
          }
        });

        // Filter out suppliers with fewer than 3 orders
        const validSuppliers = Object.values(supplierStats).filter(s => s.totalOrders >= 3);

        if (validSuppliers.length === 0) {
          return {
            category,
            itemName,
            recommendations: [
              {
                name: 'No historical data',
                message: 'No previous orders found for this category. Consider researching new suppliers.',
                suggestion: 'Add supplier information manually or contact procurement team.',
              }
            ],
          };
        }

        // Weighted scoring algorithm
        const scoredSuppliers = validSuppliers.map(s => {
          // 1. Order volume score (0-30 points)
          const volumeScore = Math.min((s.totalOrders / 20) * 30, 30);

          // 2. Recent activity score (0-25 points)
          const recencyRatio = s.recentOrders / s.totalOrders;
          const recencyScore = recencyRatio * 25;

          // 3. Freshness score (0-20 points) - based on the most recent order time
          const daysSinceLastOrder = (now - s.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
          const freshnessScore = Math.max(0, 20 - (daysSinceLastOrder / 30) * 20); // 30 days = full score

          // 4. Price stability score (0-15 points)
          const priceStdDev = calculateStdDev(s.prices);
          const priceAvg = s.prices.reduce((a, b) => a + b, 0) / s.prices.length;
          const priceCV = priceStdDev / priceAvg; // coefficient of variation
          const stabilityScore = Math.max(0, 15 - priceCV * 100); // lower CV = higher score

          // 5. Category specialization score (0-10 points)
          const specializationScore = s.categories.size === 1 ? 10 : 5; // focusing on a single category scores higher

          // Overall score
          const totalScore = volumeScore + recencyScore + freshnessScore + stabilityScore + specializationScore;

          return {
            name: s.name,
            totalOrders: s.totalOrders,
            recentOrders: s.recentOrders,
            avgPrice: priceAvg.toFixed(2),
            priceStability: priceCV < 0.1 ? 'High' : priceCV < 0.2 ? 'Medium' : 'Low',
            lastOrderDate: s.lastOrderDate.toISOString().split('T')[0],
            daysSinceLastOrder: Math.floor(daysSinceLastOrder),
            categories: Array.from(s.categories),
            score: totalScore.toFixed(1),
            rating: totalScore > 80 ? '⭐⭐⭐⭐⭐ Strongly Recommended' :
                    totalScore > 65 ? '⭐⭐⭐⭐ Recommended' :
                    totalScore > 50 ? '⭐⭐⭐ Worth Considering' : '⭐⭐ Not Recommended',
            breakdown: {
              volume: volumeScore.toFixed(1),
              recency: recencyScore.toFixed(1),
              freshness: freshnessScore.toFixed(1),
              stability: stabilityScore.toFixed(1),
              specialization: specializationScore.toFixed(1),
            },
          };
        });

        // Sort by score
        scoredSuppliers.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

        return {
          category,
          itemName,
          algorithm: 'weighted_scoring_v2',
          factors: ['order_volume', 'recent_activity', 'freshness', 'price_stability', 'specialization'],
          recommendations: scoredSuppliers.slice(0, limit),
        };
      },

      analyze_price_history: async (input) => {
        const { itemName, category, months = 6 } = input;

        // Look up historical orders
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - months);

        const orders = await prisma.purchaseOrderRecord.findMany({
          where: {
            createdAt: {
              gte: monthsAgo,
            },
          },
          orderBy: { createdAt: 'asc' },
          select: {
            payload: true,
            createdAt: true,
          },
        });

        // Extract price history
        const priceHistory = [];

        orders.forEach(order => {
          if (order.payload?.items) {
            order.payload.items.forEach(item => {
              if (
                item.itemName.toLowerCase().includes(itemName.toLowerCase()) ||
                item.itemCategory === category
              ) {
                priceHistory.push({
                  date: order.createdAt,
                  itemName: item.itemName,
                  unitPrice: parseFloat(item.unitPrice || 0),
                  quantity: item.quantity,
                  supplier: item.supplierName,
                });
              }
            });
          }
        });

        if (priceHistory.length === 0) {
          return {
            itemName,
            category,
            message: 'No historical pricing data available',
            suggestion: 'This appears to be a new item. Research market prices before purchasing.',
          };
        }

        // Calculate basic statistics
        const prices = priceHistory.map(p => p.unitPrice).filter(p => p > 0);
        if (prices.length === 0) {
          return {
            itemName,
            category,
            message: 'No valid price data',
            suggestion: 'Price information is missing or incomplete.',
          };
        }

        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const stdDev = calculateStdDev(prices);
        const priceCV = stdDev / avgPrice; // coefficient of variation

        // Calculate moving average (last 4 data points)
        const movingAverages = prices.map((_, idx, arr) => {
          const window = arr.slice(Math.max(0, idx - 3), idx + 1);
          return window.reduce((sum, p) => sum + p, 0) / window.length;
        });
        const latestMA = movingAverages[movingAverages.length - 1];

        // Linear regression trend analysis
        const regression = calculateLinearRegression(prices);
        const trendSlope = regression.slope;

        let trend, trendIndicator;
        if (trendSlope > 0.5) {
          trend = 'Rising';
          trendIndicator = '📈';
        } else if (trendSlope < -0.5) {
          trend = 'Falling';
          trendIndicator = '📉';
        } else {
          trend = 'Stable';
          trendIndicator = '➡️';
        }

        // Predict future price (based on linear regression)
        const predictedNextPrice = regression.intercept + regression.slope * prices.length;

        // Price volatility assessment
        let volatilityLevel, volatilityIndicator;
        if (priceCV < 0.1) {
          volatilityLevel = 'Low';
          volatilityIndicator = '🟢';
        } else if (priceCV < 0.2) {
          volatilityLevel = 'Medium';
          volatilityIndicator = '🟡';
        } else {
          volatilityLevel = 'High';
          volatilityIndicator = '🔴';
        }

        // Generate procurement recommendation
        let recommendation;
        if (trendSlope > 1 && priceCV > 0.15) {
          recommendation = '⚠️ Price is rising fast with high volatility — buy now and consider bulk purchasing';
        } else if (trendSlope > 0.5) {
          recommendation = '📈 Price is trending upward — recommend purchasing soon';
        } else if (trendSlope < -0.5) {
          recommendation = '💡 Price is trending downward — can wait for a better price or negotiate a discount';
        } else if (priceCV < 0.1) {
          recommendation = '✅ Price is stable — proceed with normal purchasing';
        } else {
          recommendation = '🟡 Price is fairly volatile — recommend comparing multiple quotes';
        }

        return {
          itemName,
          category,
          dataPoints: priceHistory.length,
          period: `${months} months`,

          priceStatistics: {
            current: prices[prices.length - 1].toFixed(2),
            average: avgPrice.toFixed(2),
            min: minPrice.toFixed(2),
            max: maxPrice.toFixed(2),
            range: (maxPrice - minPrice).toFixed(2),
            movingAverage: latestMA.toFixed(2),
          },

          volatility: {
            standardDeviation: stdDev.toFixed(2),
            coefficientOfVariation: (priceCV * 100).toFixed(2) + '%',
            level: volatilityLevel,
            indicator: volatilityIndicator,
          },

          trend: {
            direction: trend,
            indicator: trendIndicator,
            slope: trendSlope.toFixed(4),
            predictedNextPrice: predictedNextPrice.toFixed(2),
            confidence: priceHistory.length >= 10 ? 'high' : priceHistory.length >= 5 ? 'medium' : 'low',
          },

          recommendation,

          recentRecords: priceHistory.slice(-5).map(record => ({
            date: new Date(record.date).toISOString().split('T')[0],
            price: record.unitPrice.toFixed(2),
            supplier: record.supplier || 'Unknown',
          })),
        };
      },

      check_inventory_status: async (input) => {
        const { itemName, department } = input;

        // Simulated inventory check (a real inventory table would be needed in production)
        return {
          itemName,
          department: department || 'All',
          status: 'simulated',
          message: 'Inventory tracking not yet implemented',
          suggestion: 'Contact warehouse team for current stock levels',
          estimatedStockLevel: 'Unknown',
        };
      },

      calculate_bulk_savings: async (input) => {
        const { itemName, currentQuantity, currentPrice, bulkQuantity, bulkPrice } = input;

        const currentTotal = currentQuantity * currentPrice;
        const bulkTotal = bulkQuantity * bulkPrice;
        const savings = currentTotal - bulkTotal;
        const savingsPercent = (savings / currentTotal) * 100;

        return {
          itemName,
          currentOrder: {
            quantity: currentQuantity,
            unitPrice: currentPrice,
            total: currentTotal.toFixed(2),
          },
          bulkOrder: {
            quantity: bulkQuantity,
            unitPrice: bulkPrice,
            total: bulkTotal.toFixed(2),
          },
          savings: {
            amount: savings.toFixed(2),
            percentage: savingsPercent.toFixed(2),
          },
          recommendation: savings > 0
            ? `✅ Bulk ordering would save MYR ${savings.toFixed(2)} (${savingsPercent.toFixed(1)}%)`
            : `⚠️ Bulk ordering not cost-effective for this item`,
        };
      },

      get_purchase_requests: async (input) => {
        const { userId, limit = 10, status = 'ALL' } = input;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { department: true, role: true },
        });

        const records = await prisma.purchaseRequestRecord.findMany({
          take: 100, // Get more records for statistics
          orderBy: { createdAt: 'desc' },
        });

        let filteredRecords = records;

        // Filter by department
        if (user?.department && user.role !== 'Super Admin') {
          filteredRecords = records.filter(r => r.payload.department === user.department);
        }

        // Calculate statistics for ALL records (before status filter)
        const statistics = {
          total: filteredRecords.length,
          pending: filteredRecords.filter(r => r.payload.status === 'PENDING').length,
          submitted: filteredRecords.filter(r => r.payload.status === 'SUBMITTED').length,
          approved: filteredRecords.filter(r => r.payload.status === 'APPROVED').length,
          rejected: filteredRecords.filter(r => r.payload.status === 'REJECTED').length,
        };

        // Filter by status AFTER calculating statistics
        if (status !== 'ALL') {
          filteredRecords = filteredRecords.filter(r => r.payload.status === status);
        }

        // Limit the results for display
        const displayRecords = filteredRecords.slice(0, limit);

        return {
          statistics,
          status,
          requests: displayRecords.map(r => ({
            id: r.localId,
            prNumber: r.payload.prNumber,
            status: r.payload.status,
            department: r.payload.department,
            requestBy: r.payload.requestBy,
            requestDate: r.payload.requestDate,
            itemCount: r.payload.lineItems?.length || 0,
            items: r.payload.lineItems?.map(item => item.itemName).join(', ').substring(0, 50) + (r.payload.lineItems?.length > 1 ? '...' : ''),
            createdAt: r.createdAt,
          })),
        };
      },
    };
  }
}

export default new PurchaseAgent();
