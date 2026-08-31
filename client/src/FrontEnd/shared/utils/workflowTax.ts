import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import {
  computeLineTotal,
  computeTaxAmount,
  computeTaxBreakdown,
  taxLabelForDraftLine,
} from "../../modules/purchasing/requestCreation/constants";

export interface WorkflowTaxRule {
  taxType?: string;
  taxRate?: number;
}

export interface WorkflowTaxRecord {
  items?: DraftLineItem[];
  lineItems?: DraftLineItem[];
  subtotal?: number;
  supplierTaxApplies?: boolean;
  supplierTaxType?: string;
  supplierTaxRate?: number;
  supplierTaxRules?: WorkflowTaxRule[];
  taxAmount?: number;
  taxTotal?: number;
  amountAfterTax?: number;
  totalAmount?: number;
  total?: number;
  grandTotal?: number;
  amount?: number;
}

export interface WorkflowTaxSummary {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxBreakdown: Array<{ label: string; rate?: number; amount: number }>;
}

const TAX_LABELS: Record<string, string> = {
  TAX: "Tax",
  SST: "Sales tax",
  SALES_TAX: "Sales tax",
  SERVICE_TAX: "Service tax",
  OTHER: "Other tax",
};

function finite(value: unknown): number | undefined {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function workflowTaxRules(record: WorkflowTaxRecord): WorkflowTaxRule[] {
  if (Array.isArray(record.supplierTaxRules) && record.supplierTaxRules.length) {
    return record.supplierTaxRules;
  }
  if (
    record.supplierTaxApplies &&
    record.supplierTaxType &&
    record.supplierTaxType !== "NO_TAX"
  ) {
    return [{ taxType: record.supplierTaxType, taxRate: record.supplierTaxRate }];
  }
  return [];
}

export function workflowLineTax(item: DraftLineItem, fallbackRules: WorkflowTaxRule[] = []): {
  subtotal: number;
  taxAmount: number;
  amountAfterTax: number;
  label: string;
} {
  const subtotal = computeLineTotal(item.quantity, item.unitPrice);
  const storedAfterTax = finite(item.amountAfterTax);
  const storedTax = finite(item.taxAmount);
  const fallbackRate = fallbackRules.reduce((sum, rule) => sum + (finite(rule.taxRate) ?? 0), 0);
  const hasItemTax = item.taxType !== undefined || item.taxRate !== undefined || item.taxAmount !== undefined || item.amountAfterTax !== undefined;
  const taxAmount = storedTax !== undefined
    ? roundMoney(storedTax)
    : storedAfterTax !== undefined
      ? roundMoney(Math.max(0, storedAfterTax - subtotal))
      : hasItemTax
        ? computeTaxAmount(item.quantity, item.unitPrice, item.taxRate)
        : computeTaxAmount(item.quantity, item.unitPrice, fallbackRate);
  const label = hasItemTax
    ? taxLabelForDraftLine(item.taxType, item.taxRate)
    : fallbackRules.length
      ? fallbackRules.map((rule) => `${TAX_LABELS[String(rule.taxType || "").toUpperCase()] || "Tax"} (${Number(rule.taxRate ?? 0).toFixed(2)}%)`).join(" + ")
      : "No tax";
  return {
    subtotal,
    taxAmount,
    amountAfterTax: storedAfterTax !== undefined
      ? roundMoney(storedAfterTax)
      : roundMoney(subtotal + taxAmount),
    label,
  };
}

export function workflowTaxSummary(record: WorkflowTaxRecord): WorkflowTaxSummary {
  const items = Array.isArray(record.items) ? record.items : record.lineItems || [];
  // Workflow records can be split by supplier while retaining the original
  // order subtotal. Recalculate from the visible items so each document only
  // charges tax on the items it actually contains.
  const subtotal = roundMoney(items.length
    ? items.reduce((sum, item) => sum + computeLineTotal(item.quantity, item.unitPrice), 0)
    : finite(record.subtotal) ?? 0);
  const rules = workflowTaxRules(record);
  let taxBreakdown: WorkflowTaxSummary["taxBreakdown"] = rules.length
    ? computeTaxBreakdown(subtotal, rules).amounts.map((amount, index) => ({
        label: TAX_LABELS[String(rules[index]?.taxType || "").toUpperCase()] || "Tax",
        rate: finite(rules[index]?.taxRate) ?? 0,
        amount,
      }))
    : [];

  if (!taxBreakdown.length) {
    const lineTaxes = items.map((item) => workflowLineTax(item, rules)).filter((line) => line.taxAmount > 0);
    if (lineTaxes.length) {
      const grouped = new Map<string, { label: string; rate?: number; amount: number }>();
      items.forEach((item) => {
        const line = workflowLineTax(item, rules);
        if (line.taxAmount <= 0) return;
        const rate = finite(item.taxRate);
        const key = `${item.taxType || "TAX"}:${rate ?? ""}`;
        const existing = grouped.get(key) || {
          label: line.label,
          ...(rate !== undefined ? { rate } : {}),
          amount: 0,
        };
        existing.amount += line.taxAmount;
        grouped.set(key, existing);
      });
      taxBreakdown = Array.from(grouped.values()).map((tax) => ({ ...tax, amount: roundMoney(tax.amount) }));
    }
  }

  // Legacy rows can have only taxAmount, or only an inclusive amountAfterTax.
  if (!taxBreakdown.length) {
    const storedTax = finite(record.taxTotal) ?? finite(record.taxAmount);
    const inclusiveTax = finite(record.amountAfterTax);
    const fallbackTax = storedTax !== undefined
      ? storedTax
      : inclusiveTax !== undefined ? Math.max(0, inclusiveTax - subtotal) : 0;
    if (fallbackTax > 0) taxBreakdown = [{ label: "Tax", amount: roundMoney(fallbackTax) }];
  }

  const taxAmount = roundMoney(taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0));
  const calculatedTotal = roundMoney(subtotal + taxAmount);
  const storedTotal = [record.amountAfterTax, record.totalAmount, record.total, record.grandTotal, record.amount]
    .map(finite)
    .find((value): value is number => value !== undefined);
  return {
    subtotal,
    taxAmount,
    taxBreakdown,
    total: roundMoney(taxBreakdown.length ? calculatedTotal : (storedTotal ?? calculatedTotal)),
  };
}
