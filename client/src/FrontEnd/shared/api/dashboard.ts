import axios from "axios";
import { API_ROOT } from "./base";

export type DashboardStatistics = {
  pendingApprovals: number;
  totalRequests: number;
  totalOrders: number;
  currentMonthSpending: number;
  spendingTrend: number;
  requestsTrend: number;
  ordersTrend: number;
  trendData: Array<{
    month: string;
    requests: number;
    orders: number;
    amount: number;
  }>;
  categoryData: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  department: string;
};

/**
 * Fetch dashboard statistics
 * @param department - Optional department filter. If provided, returns stats for that department only
 */
export async function fetchDashboardStatistics(
  department?: string
): Promise<DashboardStatistics> {
  const params = department ? { department } : {};
  const res = await axios.get(`${API_ROOT}/dashboard/statistics`, { params });

  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to fetch dashboard statistics");
  }

  return res.data.data;
}
