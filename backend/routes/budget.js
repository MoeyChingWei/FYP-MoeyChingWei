import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

function isApprovedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "APPROVED";
}

function getRequestItems(payload) {
  if (Array.isArray(payload?.lineItems)) return payload.lineItems;
  return Array.isArray(payload?.items) ? payload.items : [];
}

function filterByDepartment(requests, departmentCode) {
  if (!departmentCode) return requests;
  return requests.filter(pr => {
    const dept = pr.payload?.department;
    return dept && String(dept).trim().toUpperCase() === String(departmentCode).trim().toUpperCase();
  });
}

// Debug: Log all middleware in this router
console.log("🟢 Budget router initialized - stack length:", router.stack.length);

// GET /api/budget/forecast - Get budget forecast based on approved purchase requests
router.get("/forecast", async (req, res) => {
  console.log("🔵 Budget forecast route hit - query:", req.query);
  try {
    const { startDate, endDate, category, period = "monthly", departmentCode } = req.query;

    // Fetch approved purchase requests (status: "Approved")
    const purchaseRequests = await prisma.purchaseRequestRecord.findMany({
      where: {
        ...(startDate && endDate
          ? {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Accept the current workflow's uppercase status and legacy persisted values.
    const approvedRequests = purchaseRequests.filter(
      (pr) => isApprovedStatus(pr.payload?.status)
    );

    // Filter by department if specified
    const filteredRequests = filterByDepartment(approvedRequests, departmentCode);

    // Extract and aggregate data from JSON payloads
    const aggregatedData = {};
    let totalAmount = 0;
    let totalApprovedCount = 0;

    filteredRequests.forEach((request) => {
      const payload = request.payload;

      // Extract date and amount from payload
      const orderDate = new Date(request.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth() + 1;
      const quarter = Math.ceil(month / 3);

      // Build period key based on requested period
      let periodKey;
      if (period === "quarterly") {
        periodKey = `${year}-Q${quarter}`;
      } else if (period === "yearly") {
        periodKey = `${year}`;
      } else {
        periodKey = `${year}-${String(month).padStart(2, "0")}`;
      }

      // Extract items and calculate total (reserved budget)
      const items = getRequestItems(payload);
      const requestTotal = items.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return sum + quantity * unitPrice;
      }, 0);

      // Initialize period if not exists
      if (!aggregatedData[periodKey]) {
        aggregatedData[periodKey] = {
          period: periodKey,
          totalAmount: 0,
          requestCount: 0,
          categories: {},
        };
      }

      // Aggregate by period
      aggregatedData[periodKey].totalAmount += requestTotal;
      aggregatedData[periodKey].requestCount += 1;
      totalAmount += requestTotal;
      totalApprovedCount += 1;

      // Aggregate by category if items have category info
      items.forEach((item) => {
        const itemCategory = item.itemCategory || "Uncategorized";
        if (!aggregatedData[periodKey].categories[itemCategory]) {
          aggregatedData[periodKey].categories[itemCategory] = 0;
        }
        const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
        aggregatedData[periodKey].categories[itemCategory] += itemTotal;
      });
    });

    // Convert to array and sort by period
    const historicalData = Object.values(aggregatedData).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    // Calculate forecast for next periods using moving average
    const forecast = [];
    if (historicalData.length >= 3) {
      const recentPeriods = historicalData.slice(-3);
      const avgAmount = recentPeriods.reduce((sum, p) => sum + p.totalAmount, 0) / 3;
      const avgCount = recentPeriods.reduce((sum, p) => sum + p.requestCount, 0) / 3;

      // Calculate trend for confidence level
      const amounts = recentPeriods.map(p => p.totalAmount);
      const trend = amounts[2] - amounts[0];
      const avgTrend = Math.abs(trend) / avgAmount;

      // Generate forecast for next 3 periods
      for (let i = 1; i <= 3; i++) {
        const lastPeriod = historicalData[historicalData.length - 1].period;
        let nextPeriod;

        if (period === "quarterly") {
          const [year, q] = lastPeriod.split("-Q");
          const nextQ = parseInt(q) + i;
          const nextYear = parseInt(year) + Math.floor((nextQ - 1) / 4);
          const quarter = ((nextQ - 1) % 4) + 1;
          nextPeriod = `${nextYear}-Q${quarter}`;
        } else if (period === "yearly") {
          nextPeriod = `${parseInt(lastPeriod) + i}`;
        } else {
          const [year, month] = lastPeriod.split("-");
          const nextMonth = parseInt(month) + i;
          const nextYear = parseInt(year) + Math.floor((nextMonth - 1) / 12);
          const monthNum = ((nextMonth - 1) % 12) + 1;
          nextPeriod = `${nextYear}-${String(monthNum).padStart(2, "0")}`;
        }

        // Determine confidence level based on trend stability
        let confidence = "medium";
        if (avgTrend < 0.1) {
          confidence = "high"; // Stable trend
        } else if (avgTrend > 0.3) {
          confidence = "low"; // Volatile trend
        }

        forecast.push({
          period: nextPeriod,
          forecastAmount: Math.round(avgAmount * 100) / 100,
          confidence: confidence,
        });
      }
    }

    // Calculate average per period
    const avgPerPeriod = historicalData.length > 0
      ? Math.round((totalAmount / historicalData.length) * 100) / 100
      : 0;

    res.json({
      success: true,
      data: {
        historical: historicalData,
        forecast,
        summary: {
          totalHistoricalAmount: Math.round(totalAmount * 100) / 100,
          totalRequests: totalApprovedCount,
          avgPerPeriod: avgPerPeriod,
          periodType: period,
          dateRange: {
            start: startDate || historicalData[0]?.period,
            end: endDate || historicalData[historicalData.length - 1]?.period,
          },
        },
      },
    });
  } catch (error) {
    console.error("Budget forecast error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate budget forecast",
      error: error.message,
    });
  }
});

export default router;
