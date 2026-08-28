import axios from "axios";

import { getSessionUser } from "../auth/session";
import { API_ROOT } from "./base";

const API = `${API_ROOT}/supplier-tax`;

export type SupplierTaxType = "NO_TAX" | "SALES_TAX" | "SERVICE_TAX" | "OTHER";

export interface SupplierTaxRule {
  taxType: Exclude<SupplierTaxType, "NO_TAX">;
  taxRate: number;
}

export interface SupplierTaxSettings {
  supplierId: number;
  taxApplies: boolean;
  taxType: SupplierTaxType;
  taxRate: number;
  taxRules: SupplierTaxRule[];
  updatedAt?: string;
}

function actor(): { userId: number; email: string } {
  const user = getSessionUser();
  if (!user) throw new Error("You must be signed in to manage tax settings");
  return { userId: user.id, email: user.email };
}

function errorMessage(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && error.response?.data?.message) return new Error(String(error.response.data.message));
  return new Error(fallback);
}

export async function fetchSupplierTaxSettings(supplierIds?: number[]): Promise<SupplierTaxSettings[]> {
  try {
    const response = await axios.get<{ success: boolean; settings?: SupplierTaxSettings[]; message?: string }>(
      `${API}/settings`,
      { params: supplierIds?.length ? { supplierIds: supplierIds.join(",") } : undefined },
    );
    if (!response.data.success) throw new Error(response.data.message ?? "Unable to load supplier tax settings");
    return response.data.settings ?? [];
  } catch (error) {
    throw errorMessage(error, "Unable to load supplier tax settings");
  }
}

export async function saveSupplierTaxSettings(values: Omit<SupplierTaxSettings, "supplierId" | "updatedAt">): Promise<SupplierTaxSettings> {
  try {
    const response = await axios.put<{ success: boolean; settings?: SupplierTaxSettings; message?: string }>(
      `${API}/settings`,
      { ...actor(), ...values },
    );
    if (!response.data.success || !response.data.settings) throw new Error(response.data.message ?? "Unable to save supplier tax settings");
    return response.data.settings;
  } catch (error) {
    throw errorMessage(error, "Unable to save supplier tax settings");
  }
}
