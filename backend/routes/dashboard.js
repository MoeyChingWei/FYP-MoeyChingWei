import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

/**
 * GET /api/dashboard/statistics
 * Get dashboard statistics filtered by department
 * Query params:
 *   - department: string (optional) - filter by department, if not provided returns all data
 */
router.get("/statistics", async (req, res) => {
  try {
    const { department } = req.query;

    // Fetch all workflow records
    const [purchaseRequests, purchaseOrders] = await Promise.all([
      prisma.purchaseRequestRecord.findMany({
        select: { payload: true, createdAt: true, updatedAt: true },
      }),
      prisma.purchaseOrderRecord.findMany({
        select: { payload: true, createdAt: true, updatedAt: true },
      }),
    ]);

    // Filter by department if specified
    const filterByDepartment = (records) => {
      if (!department) return records;
      return records.filter(
        (record) =>
          record.payload &&
          typeof record.payload === "object" &&
          record.payload.department === department
      );
    };

    const filteredRequests = filterByDepartment(purchaseRequests);
    const filteredOrders = filterByDepartment(purchaseOrders);

    // Calculate pending approvals (requests/orders with status 'pending')
    const pendingApprovals = [
      ...filteredRequests.filter(
        (r) => r.payload?.status === "pending" || r.payload?.status === "submitted"
      ),
      ...filteredOrders.filter((o) => o.payload?.status === "pending"),
    ].length;

    // Calculate total requests and orders
    const totalRequests = filteredRequests.length;
    const totalOrders = filteredOrders.length;

    // Calculate monthly spending and trends (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyData = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthKey = date.toLocaleString("en-US", { month: "short" });
      monthlyData[monthKey] = { requests: 0, orders: 0, amount: 0 };
    }

    // Process requests by month
    filteredRequests.forEach((record) => {
      const date = new Date(record.createdAt);
      if (date >= sixMonthsAgo) {
        const monthKey = date.toLocaleString("en-US", { month: "short" });
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].requests++;
        }
      }
    });

    // Process orders by month and calculate spending
    filteredOrders.forEach((record) => {
      const date = new Date(record.createdAt);
      if (date >= sixMonthsAgo) {
        const monthKey = date.toLocaleString("en-US", { month: "short" });
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].orders++;
          // Calculate total amount from items
          if (record.payload?.items && Array.isArray(record.payload.items)) {
            const orderTotal = record.payload.items.reduce((sum, item) => {
              const qty = parseFloat(item.quantity) || 0;
              const price = parseFloat(item.unitPrice) || 0;
              return sum + qty * price;
            }, 0);
            monthlyData[monthKey].amount += orderTotal;
          }
        }
      }
    });

    const trendData = Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));

    // Calculate current month and previous month spending for trend
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthSpending = filteredOrders
      .filter((record) => new Date(record.createdAt) >= currentMonth)
      .reduce((sum, record) => {
        if (record.payload?.items && Array.isArray(record.payload.items)) {
          return (
            sum +
            record.payload.items.reduce((itemSum, item) => {
              const qty = parseFloat(item.quantity) || 0;
              const price = parseFloat(item.unitPrice) || 0;
              return itemSum + qty * price;
            }, 0)
          );
        }
        return sum;
      }, 0);

    const previousMonthSpending = filteredOrders
      .filter(
        (record) =>
          new Date(record.createdAt) >= previousMonth &&
          new Date(record.createdAt) < currentMonth
      )
      .reduce((sum, record) => {
        if (record.payload?.items && Array.isArray(record.payload.items)) {
          return (
            sum +
            record.payload.items.reduce((itemSum, item) => {
              const qty = parseFloat(item.quantity) || 0;
              const price = parseFloat(item.unitPrice) || 0;
              return itemSum + qty * price;
            }, 0)
          );
        }
        return sum;
      }, 0);

    const spendingTrend =
      previousMonthSpending > 0
        ? ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100
        : 0;

    // Calculate spending by category
    const categoryMap = {};
    filteredOrders.forEach((record) => {
      if (record.payload?.items && Array.isArray(record.payload.items)) {
        record.payload.items.forEach((item) => {
          const category = item.category || "Uncategorized";
          const qty = parseFloat(item.quantity) || 0;
          const price = parseFloat(item.unitPrice) || 0;
          const amount = qty * price;

          if (!categoryMap[category]) {
            categoryMap[category] = { amount: 0, count: 0 };
          }
          categoryMap[category].amount += amount;
          categoryMap[category].count++;
        });
      }
    });

    const categoryData = Object.keys(categoryMap)
      .map((category) => ({
        category,
        amount: Math.round(categoryMap[category].amount),
        count: categoryMap[category].count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 categories

    // Calculate trend for requests (comparing this month vs last month)
    const currentMonthRequests = filteredRequests.filter(
      (record) => new Date(record.createdAt) >= currentMonth
    ).length;
    const previousMonthRequests = filteredRequests.filter(
      (record) =>
        new Date(record.createdAt) >= previousMonth &&
        new Date(record.createdAt) < currentMonth
    ).length;
    const requestsTrend =
      previousMonthRequests > 0
        ? ((currentMonthRequests - previousMonthRequests) / previousMonthRequests) * 100
        : 0;

    // Calculate trend for orders
    const currentMonthOrders = filteredOrders.filter(
      (record) => new Date(record.createdAt) >= currentMonth
    ).length;
    const previousMonthOrders = filteredOrders.filter(
      (record) =>
        new Date(record.createdAt) >= previousMonth &&
        new Date(record.createdAt) < currentMonth
    ).length;
    const ordersTrend =
      previousMonthOrders > 0
        ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100
        : 0;

    return res.json({
      success: true,
      data: {
        pendingApprovals,
        totalRequests,
        totalOrders,
        currentMonthSpending: Math.round(currentMonthSpending),
        spendingTrend: Math.round(spendingTrend * 10) / 10, // Round to 1 decimal
        requestsTrend: Math.round(requestsTrend * 10) / 10,
        ordersTrend: Math.round(ordersTrend * 10) / 10,
        trendData,
        categoryData,
        department: department || "All Departments",
      },
    });
  } catch (err) {
    console.error("GET /api/dashboard/statistics error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
