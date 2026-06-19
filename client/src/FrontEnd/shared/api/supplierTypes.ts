import axios from "axios";
import { API_ROOT } from "./base";

export type SupplierTypeMap = Record<string, string[]>;

const API = API_ROOT;

export async function fetchSupplierTypeMap(): Promise<SupplierTypeMap> {
  const res = await axios.get(`${API}/admin/supplier-types`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to load supplier types");
  }
  const rawMap = res.data?.supplierTypeMap;
  return rawMap && typeof rawMap === "object" ? (rawMap as SupplierTypeMap) : {};
}

export async function updateSupplierTypes(
  userId: number,
  categories: string[],
): Promise<string[]> {
  const res = await axios.put(`${API}/admin/supplier-types/${userId}`, {
    categories,
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to update supplier types");
  }
  return Array.isArray(res.data?.categories) ? (res.data.categories as string[]) : [];
}
