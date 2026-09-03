/** Dropdown options for purchase request item category. */
export const ITEM_CATEGORIES = [
  "IT Equipment",
  "Office Supplies / Stationery",
  "Furniture and Fixtures",
  "Maintenance and Repair Items",
  "Cleaning and Pantry Supplies",
  "Operational Equipment",
  "Books / Training / Learning Materials",
  "Marketing and Printing Materials",
  "Services Procurement",
  "Raw Materials / Production Items",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

/**
 * Shared built-in units for purchasing and supplier inventory.  Keep this
 * list aligned with the supplier catalogue so an existing inventory item can
 * always be selected again when it is edited.
 */
export const UNITS_OF_MEASUREMENT = [
  "pcs",
  "box",
  "unit",
  "sets",
  "reams",
  "bottles",
  "rolls",
  "cartons",
  "bags",
  "services",
] as const;

export type UnitOfMeasurement = (typeof UNITS_OF_MEASUREMENT)[number];

export const MALAYSIAN_TAXES = {
  TAX: { label: "Tax", rate: 10 },
  SERVICE_TAX: { label: "Service tax", rate: 6 },
} as const;

export type MalaysianTaxCode = keyof typeof MALAYSIAN_TAXES;

export function normalizeTaxCodes(value: unknown): MalaysianTaxCode[] {
  const rawValues = Array.isArray(value) ? value : String(value ?? "").split(",");
  const codes = rawValues.map((entry) => String(entry).trim().toUpperCase());
  const normalized = codes.map((code) => code === "SST" || code === "SALES_TAX" ? "TAX" : code);
  return Array.from(new Set(normalized.filter((code): code is MalaysianTaxCode => code in MALAYSIAN_TAXES)));
}

export function taxRateForCodes(value: unknown): number {
  return normalizeTaxCodes(value).reduce((sum, code) => sum + MALAYSIAN_TAXES[code].rate, 0);
}

export function taxLabelForCodes(value: unknown): string {
  const codes = normalizeTaxCodes(value);
  return codes.length ? codes.map((code) => `${MALAYSIAN_TAXES[code].label} (${MALAYSIAN_TAXES[code].rate}%)`).join(" + ") : "No tax";
}

export function taxLabelForDraftLine(taxType: unknown, taxRate: unknown): string {
  const label = taxLabelForCodes(taxType);
  if (label !== "No tax") return label;

  const rate = Number(taxRate);
  return Number.isFinite(rate) && rate > 0 ? `Tax (${rate}%)` : label;
}

export function generatePrNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PR-${y}${m}${day}-${rand}`;
}

/** YYYY-MM-DD for the current local date. */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeLineTotal(quantity: unknown, unitPrice: unknown): number {
  const q = typeof quantity === "number" ? quantity : Number(quantity);
  const p = typeof unitPrice === "number" ? unitPrice : Number(unitPrice);
  if (!Number.isFinite(q) || !Number.isFinite(p)) return 0;
  return Math.round(q * p * 100) / 100;
}

export function computeTaxAmount(quantity: unknown, unitPrice: unknown, taxRate: unknown): number {
  const subtotal = computeLineTotal(quantity, unitPrice);
  const rate = typeof taxRate === "string" || Array.isArray(taxRate)
    ? taxRateForCodes(taxRate)
    : Number(taxRate);
  if (!Number.isFinite(rate) || rate <= 0) return 0;
  return Math.round(subtotal * rate / 100 * 100) / 100;
}

export function computeAmountAfterTax(quantity: unknown, unitPrice: unknown, taxRate: unknown): number {
  return Math.round((computeLineTotal(quantity, unitPrice) + computeTaxAmount(quantity, unitPrice, taxRate)) * 100) / 100;
}

export interface TaxRuleInput {
  taxType?: string;
  taxRate?: number;
}

/** Calculates each configured tax against the original subtotal. */
export function computeTaxBreakdown(subtotal: number, rules: TaxRuleInput[]): { amounts: number[]; total: number } {
  const amounts: number[] = [];
  for (const rule of rules) {
    const rate = Number(rule.taxRate ?? 0);
    if (!Number.isFinite(rate) || rate <= 0) { amounts.push(0); continue; }
    const amount = Math.round(subtotal * rate) / 100;
    amounts.push(amount);
  }
  return { amounts, total: Math.round(amounts.reduce((sum, amount) => sum + amount, 0) * 100) / 100 };
}

export function computeDraftLineAmountAfterTax(item: {
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  taxAmount?: number;
  amountAfterTax?: number;
}): number {
  if (Number.isFinite(item.amountAfterTax)) {
    return item.amountAfterTax as number;
  }

  const subtotal = computeLineTotal(item.quantity, item.unitPrice);
  const taxAmount = Number.isFinite(item.taxAmount)
    ? (item.taxAmount as number)
    : computeTaxAmount(item.quantity, item.unitPrice, item.taxRate);
  return Math.round((subtotal + taxAmount) * 100) / 100;
}
