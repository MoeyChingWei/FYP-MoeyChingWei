import axios from "axios";

import {
  ITEM_CATEGORIES,
  UNITS_OF_MEASUREMENT,
} from "../../modules/purchasing/requestCreation/constants";
import { API_ROOT } from "./base";

export type PurchasingLookupKind = "ITEM_CATEGORY" | "UNIT_OF_MEASURE";

export interface PurchasingLookupRow {
  id: number;
  value: string;
  createdAt: string;
}

export function defaultOptionsForKind(
  kind: PurchasingLookupKind,
): readonly string[] {
  return kind === "ITEM_CATEGORY" ? ITEM_CATEGORIES : UNITS_OF_MEASUREMENT;
}

/** Built-in list first (fixed order), then custom values not already present (case-insensitive). */
export function mergePurchasingOptions(
  kind: PurchasingLookupKind,
  customRows: Pick<PurchasingLookupRow, "value">[],
): string[] {
  const defaults = [...defaultOptionsForKind(kind)];
  const seen = new Set(defaults.map((v) => v.toLowerCase()));
  const out = [...defaults];
  for (const row of customRows) {
    const v = String(row.value ?? "").trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

export async function fetchPurchasingLookups(
  kind: PurchasingLookupKind,
): Promise<PurchasingLookupRow[]> {
  const res = await axios.get<{ success: boolean; items?: PurchasingLookupRow[]; message?: string }>(
    `${API_ROOT}/purchasing/lookups`,
    { params: { kind } },
  );
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to load lists");
  }
  return res.data.items ?? [];
}

export async function createPurchasingLookup(
  kind: PurchasingLookupKind,
  value: string,
): Promise<PurchasingLookupRow> {
  const res = await axios.post<{
    success: boolean;
    item?: PurchasingLookupRow;
    message?: string;
  }>(`${API_ROOT}/purchasing/lookups`, { kind, value });
  if (!res.data?.success || !res.data.item) {
    throw new Error(res.data?.message ?? "Could not add value");
  }
  return res.data.item;
}

export async function deletePurchasingLookup(id: number): Promise<void> {
  const res = await axios.delete<{ success: boolean; message?: string }>(
    `${API_ROOT}/purchasing/lookups/${id}`,
  );
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Could not delete");
  }
}
