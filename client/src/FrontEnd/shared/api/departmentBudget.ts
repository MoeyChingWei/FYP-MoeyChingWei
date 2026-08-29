import axios from "axios";
import { API_ROOT } from "./base";
import { getSessionUser } from "../auth/session";

const API = `${API_ROOT}/department-budget`;

export const toBudgetNumber = (value: unknown): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export interface BudgetDeductionResult {
  success: boolean;
  deductedAmount?: number;
  budgetId?: number;
  warnings?: Array<{ threshold: number; percentage: number }>;
  reason?: string;
}

export interface BudgetReservationResult {
  success: boolean;
  reservedAmount?: number;
  releasedAmount?: number;
  budgetId?: number;
  alreadyProcessed?: boolean;
  reason?: string;
}

async function postBudgetWorkflowAction(
  action: "reserve" | "release",
  prPayload: any,
): Promise<BudgetReservationResult> {
  try {
    const user = getSessionUser();
    if (!user) return { success: false, reason: "Authentication required" };

    const res = await axios.post(`${API}/usage/${action}`, {
      prPayload,
      userId: user.id,
      email: user.email,
    });
    return res.data.success
      ? res.data.data
      : { success: false, reason: res.data.message };
  } catch (error: any) {
    console.error(`Budget ${action} error:`, error);
    return {
      success: false,
      reason: error.response?.data?.message || error.message || `Failed to ${action} budget`,
    };
  }
}

export function reserveBudgetForPR(prPayload: any): Promise<BudgetReservationResult> {
  return postBudgetWorkflowAction("reserve", prPayload);
}

export function releaseBudgetForPR(prPayload: any): Promise<BudgetReservationResult> {
  return postBudgetWorkflowAction("release", prPayload);
}

export async function deductBudgetForPR(prPayload: any): Promise<BudgetDeductionResult> {
  try {
    const user = getSessionUser();
    if (!user) {
      return { success: false, reason: "Authentication required" };
    }

    const res = await axios.post(`${API}/usage/deduct`, {
      prPayload,
      userId: user.id,
      email: user.email,
    });
    return res.data.success ? res.data.data : { success: false, reason: res.data.message };
  } catch (error: any) {
    console.error("Budget deduction error:", error);
    return {
      success: false,
      reason: error.response?.data?.message || error.message || "Failed to deduct budget"
    };
  }
}

export interface BudgetUsageSummary {
  budgetId: number;
  department: { id: number; code: string; name: string };
  year: number;
  month: number;
  allocatedAmount: number;
  spentAmount: number;
  reservedAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  status: "normal" | "warning" | "exceeded";
}

export async function getBudgetUsage(
  departmentId: number,
  year: number,
  month: number
): Promise<BudgetUsageSummary | null> {
  try {
    const user = getSessionUser();
    if (!user) {
      console.error("No session user found");
      return null;
    }
    const res = await axios.get(`${API}/usage/${departmentId}`, {
      params: { userId: user.id, email: user.email, year, month }
    });
    if (!res.data.success) return null;

    const data = res.data.data;
    return {
      ...data,
      allocatedAmount: toBudgetNumber(data.allocatedAmount),
      spentAmount: toBudgetNumber(data.spentAmount),
      reservedAmount: toBudgetNumber(data.reservedAmount),
      remainingAmount: toBudgetNumber(data.remainingAmount),
      usagePercentage: toBudgetNumber(data.usagePercentage)
    };
  } catch (error) {
    console.error("Get budget usage error:", error);
    return null;
  }
}

export interface Department {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface MonthlyBudget {
  id: number;
  departmentId: number;
  year: number;
  month: number;
  allocatedAmount: number;
  spentAmount: number;
  reservedAmount: number;
  notes?: string;
  department?: Department;
}

export interface OwnBudgetHistoryRow {
  period: string;
  year: number;
  month: number;
  budgetId: number | null;
  allocatedAmount: number | null;
  spentAmount: number | null;
  remainingAmount: number | null;
  status: "approved" | "ai_auto_generated" | "pending" | "rejected" | "not_set";
  source: "Finance approval" | "AI prediction" | null;
}

export async function getOwnBudgetHistory(): Promise<{ department: Department; currentPeriod: string; rows: OwnBudgetHistoryRow[] } | null> {
  try {
    const user = getSessionUser();
    if (!user) return null;
    const res = await axios.get(`${API}/my-budget-history`, {
      params: { userId: user.id, email: user.email }
    });
    if (!res.data.success) return null;
    return {
      ...res.data.data,
      rows: res.data.data.rows.map((row: OwnBudgetHistoryRow) => ({
        ...row,
        allocatedAmount: row.allocatedAmount == null ? null : toBudgetNumber(row.allocatedAmount),
        spentAmount: row.spentAmount == null ? null : toBudgetNumber(row.spentAmount),
        remainingAmount: row.remainingAmount == null ? null : toBudgetNumber(row.remainingAmount),
      }))
    };
  } catch (error) {
    console.error("Get own budget history error:", error);
    return null;
  }
}

export interface BudgetPrediction {
  id: number;
  departmentId: number;
  targetYear: number;
  targetMonth: number;
  predictedAmount: number;
  confidence: "very_high" | "high" | "medium" | "low";
  triggerType: "automatic" | "manual";
  triggeredBy: number;
  aiInsights?: string;
  algorithm?: string;
  categoryBreakdown?: Record<string, number>;
  comparisonData?: {
    lastMonthAmount?: number;
    avgAmount?: number;
    trend?: "increasing" | "decreasing" | "stable" | string;
    historicalPeriods?: number;
    usedFallback?: boolean;
    predictionInterval?: { lower?: number; upper?: number };
    modelBreakdown?: Record<string, number>;
    similarDepartment?: string;
    similarity?: number;
    referenceMonths?: number;
    riskAdjustment?: {
      baseForecast: number;
      contingencyReserve: number;
      reserveRate: number;
      expectedEventImpact: number;
      contributors: Array<{
        type: string;
        label: string;
        rate?: number;
        amount?: number;
        likelihood?: "low" | "medium" | "high";
        growthRate?: number;
      }>;
      scenarios: { conservative: number; recommended: number; highRisk: number };
    };
  };
  metadata?: any;
  createdAt: string;
  department?: Department;
  triggeredByUser?: { id: number; name: string; email: string };
}

export interface UpcomingForecastEvent {
  id: number;
  departmentId: number;
  title: string;
  targetYear: number;
  targetMonth: number;
  estimatedImpact: number;
  likelihood: "low" | "medium" | "high";
  notes?: string | null;
  status: "active" | "cancelled";
  createdAt: string;
  creator?: { id: number; name?: string | null };
}

export async function getUpcomingForecastEvents(
  departmentId: number,
  targetYear: number,
  targetMonth: number,
): Promise<UpcomingForecastEvent[]> {
  try {
    const user = getSessionUser();
    if (!user) return [];
    const res = await axios.get(`${API}/upcoming-events/${departmentId}`, {
      params: { userId: user.id, email: user.email, year: targetYear, month: targetMonth },
    });
    return res.data.success ? res.data.data.map((event: UpcomingForecastEvent) => ({
      ...event,
      estimatedImpact: toBudgetNumber(event.estimatedImpact),
    })) : [];
  } catch (error) {
    console.error("Get upcoming forecast events error:", error);
    return [];
  }
}

export async function createUpcomingForecastEvent(input: Omit<UpcomingForecastEvent, "id" | "status" | "createdAt" | "creator">): Promise<UpcomingForecastEvent | null> {
  try {
    const user = getSessionUser();
    if (!user) return null;
    const res = await axios.post(`${API}/upcoming-events`, { ...input, userId: user.id, email: user.email });
    return res.data.success ? { ...res.data.data, estimatedImpact: toBudgetNumber(res.data.data.estimatedImpact) } : null;
  } catch (error) {
    console.error("Create upcoming forecast event error:", error);
    return null;
  }
}

export async function cancelUpcomingForecastEvent(id: number): Promise<boolean> {
  try {
    const user = getSessionUser();
    if (!user) return false;
    const res = await axios.delete(`${API}/upcoming-events/${id}`, { params: { userId: user.id, email: user.email } });
    return Boolean(res.data.success);
  } catch (error) {
    console.error("Cancel upcoming forecast event error:", error);
    return false;
  }
}

export async function getDepartments(isActive?: boolean): Promise<Department[]> {
  try {
    const user = getSessionUser();
    if (!user) {
      console.error("No session user found");
      return [];
    }
    const params: any = { userId: user.id, email: user.email };
    if (isActive !== undefined) {
      params.isActive = String(isActive);
    }
    const res = await axios.get(`${API}/departments`, { params });
    if (!res.data.success) return [];

    return res.data.data.map((budget: MonthlyBudget) => ({
      ...budget,
      allocatedAmount: toBudgetNumber(budget.allocatedAmount),
      spentAmount: toBudgetNumber(budget.spentAmount),
      reservedAmount: toBudgetNumber(budget.reservedAmount)
    }));
  } catch (error) {
    console.error("Get departments error:", error);
    return [];
  }
}

export async function getMonthlyBudgets(
  departmentId: number,
  year?: number,
  month?: number
): Promise<MonthlyBudget[]> {
  try {
    const user = getSessionUser();
    if (!user) {
      console.error("No session user found");
      return [];
    }
    const params: any = { userId: user.id, email: user.email };
    if (year) params.year = year;
    if (month) params.month = month;
    const res = await axios.get(`${API}/monthly/${departmentId}`, { params });
    if (!res.data.success) return [];

    return res.data.data.map((budget: MonthlyBudget) => ({
      ...budget,
      allocatedAmount: toBudgetNumber(budget.allocatedAmount),
      spentAmount: toBudgetNumber(budget.spentAmount),
      reservedAmount: toBudgetNumber(budget.reservedAmount)
    }));
  } catch (error) {
    console.error("Get monthly budgets error:", error);
    return [];
  }
}

export async function getPredictions(
  departmentId: number,
  filters?: {
    year?: number;
    month?: number;
    confidence?: string;
    triggerType?: string;
    limit?: number;
  }
): Promise<BudgetPrediction[]> {
  try {
    const user = getSessionUser();
    if (!user) {
      console.error("No session user found");
      return [];
    }
    const params: any = { userId: user.id, email: user.email, ...(filters || {}) };
    const res = await axios.get(`${API}/predictions/${departmentId}`, { params });
    return res.data.success ? res.data.data : [];
  } catch (error) {
    console.error("Get predictions error:", error);
    return [];
  }
}

export interface HistoricalData {
  year: number;
  month: number;
  period: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  hasAllocatedBudget: boolean;
  utilization: number;
}

export interface HistoricalComparison {
  historicalData: HistoricalData[];
  summary: {
    totalPeriods: number;
    budgetedPeriods: number;
    avgAllocated: number;
    avgSpent: number;
    avgUtilization: number;
    totalAllocated: number;
    totalSpent: number;
  };
}

export async function getHistoricalComparison(
  departmentId: number,
  options: { preset?: string; startDate?: string; endDate?: string }
): Promise<HistoricalComparison | null> {
  try {
    const user = getSessionUser();
    if (!user) {
      console.error("No session user found");
      return null;
    }
    const params = { userId: user.id, email: user.email, ...options };
    const res = await axios.get(`${API}/historical/${departmentId}`, { params });
    if (!res.data.success) return null;

    const data = res.data.data;
    return {
      ...data,
      historicalData: data.historicalData.map((period: HistoricalData) => ({
        ...period,
        allocatedAmount: toBudgetNumber(period.allocatedAmount),
        spentAmount: toBudgetNumber(period.spentAmount),
        remainingAmount: toBudgetNumber(period.remainingAmount),
        utilization: toBudgetNumber(period.utilization)
      })),
      summary: {
        ...data.summary,
        avgAllocated: toBudgetNumber(data.summary.avgAllocated),
        avgSpent: toBudgetNumber(data.summary.avgSpent),
        avgUtilization: toBudgetNumber(data.summary.avgUtilization),
        totalAllocated: toBudgetNumber(data.summary.totalAllocated),
        totalSpent: toBudgetNumber(data.summary.totalSpent)
      }
    };
  } catch (error) {
    console.error("Get historical comparison error:", error);
    return null;
  }
}
