import axios from "axios";
import { API_ROOT } from "./base";

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
    const res = await axios.get(`${API}/usage/${departmentId}`, {
      params: { year, month }
    });
    return res.data.success ? res.data.data : null;
  } catch (error) {
    console.error("Get budget usage error:", error);
    return null;
  }
}
