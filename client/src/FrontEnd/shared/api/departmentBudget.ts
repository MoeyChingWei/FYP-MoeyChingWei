import axios from "axios";
import { API_ROOT } from "./base";
import { getSessionUser } from "../auth/session";

const API = `${API_ROOT}/department-budget`;

export interface BudgetDeductionResult {
  success: boolean;
  deductedAmount?: number;
  budgetId?: number;
  warnings?: Array<{ threshold: number; percentage: number }>;
  reason?: string;
}

export async function deductBudgetForPR(prPayload: any): Promise<BudgetDeductionResult> {
  try {
    const res = await axios.post(`${API}/usage/deduct`, { prPayload });
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
    return res.data.success ? res.data.data : null;
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

export interface BudgetPrediction {
  id: number;
  departmentId: number;
  targetYear: number;
  targetMonth: number;
  predictedAmount: number;
  confidence: "high" | "medium" | "low";
  triggerType: "automatic" | "manual";
  triggeredBy: number;
  metadata?: any;
  createdAt: string;
  department?: Department;
  triggeredByUser?: { id: number; name: string; email: string };
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
    return res.data.success ? res.data.data : [];
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
    return res.data.success ? res.data.data : [];
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
  utilization: number;
}

export interface HistoricalComparison {
  historicalData: HistoricalData[];
  summary: {
    totalPeriods: number;
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
    return res.data.success ? res.data.data : null;
  } catch (error) {
    console.error("Get historical comparison error:", error);
    return null;
  }
}
