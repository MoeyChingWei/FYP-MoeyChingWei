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

export const UNITS_OF_MEASUREMENT = ["pcs", "box", "unit"] as const;

export type UnitOfMeasurement = (typeof UNITS_OF_MEASUREMENT)[number];

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
