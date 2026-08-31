const TAX_LABELS = {
  SALES_TAX: "Sales tax",
  SERVICE_TAX: "Service tax",
  OTHER: "Other tax",
};

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function itemTaxBreakdown(items) {
  const taxes = new Map();
  for (const item of items) {
    const rate = finiteNumber(item?.taxRate) ?? 0;
    const lineSubtotal = (finiteNumber(item?.quantity) ?? 0) * (finiteNumber(item?.unitPrice) ?? 0);
    const amount = finiteNumber(item?.taxAmount) ?? Math.round(lineSubtotal * rate) / 100;
    if (!rate && !amount) continue;
    const taxType = String(item?.taxType || "TAX").toUpperCase();
    const key = `${taxType}:${rate}`;
    const current = taxes.get(key) || { label: TAX_LABELS[taxType] || "Tax", rate, amount: 0 };
    current.amount += amount;
    taxes.set(key, current);
  }
  return [...taxes.values()].map((tax) => ({ ...tax, amount: Math.round(tax.amount * 100) / 100 }));
}

/**
 * Calculates supplier/order-level tax for workflow PDFs and emails. Keeping
 * this in one place prevents the approval email and its PDF attachment from
 * showing different tax amounts or totals.
 */
export function calculateWorkflowTotals(record = {}) {
  const items = Array.isArray(record.items)
    ? record.items
    : (Array.isArray(record.lineItems) ? record.lineItems : []);
  // Supplier acknowledgement/delivery/GRN records may retain the original
  // order subtotal even after items are split by supplier. Use visible items
  // for the document subtotal so tax and totals stay scoped to this record.
  const subtotal = items.length
    ? items.reduce((sum, item) => sum + (finiteNumber(item.quantity) ?? 0) * (finiteNumber(item.unitPrice) ?? 0), 0)
    : finiteNumber(record.subtotal) ?? 0;
  const taxRules = Array.isArray(record.supplierTaxRules) && record.supplierTaxRules.length
    ? record.supplierTaxRules
    : record.supplierTaxApplies && record.supplierTaxType && record.supplierTaxType !== "NO_TAX"
      ? [{ taxType: record.supplierTaxType, taxRate: record.supplierTaxRate }]
      : [];
  let taxBreakdown = taxRules.map((rule) => {
    const rate = finiteNumber(rule?.taxRate) ?? 0;
    return {
      label: TAX_LABELS[String(rule?.taxType || "").toUpperCase()] || "Tax",
      rate,
      amount: Math.round(subtotal * rate) / 100,
    };
  });
  if (!taxBreakdown.length) {
    taxBreakdown = itemTaxBreakdown(items);
  }
  const storedTaxAmount = finiteNumber(record.taxTotal) ?? finiteNumber(record.taxAmount);
  if (!taxBreakdown.length && storedTaxAmount) {
    taxBreakdown = [{ label: "Tax", rate: null, amount: storedTaxAmount }];
  }
  const taxAmount = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0);
  const calculatedTotal = Math.round((subtotal + taxAmount) * 100) / 100;
  const storedTotal = finiteNumber(record.amountAfterTax)
    ?? finiteNumber(record.totalAmount)
    ?? finiteNumber(record.total)
    ?? finiteNumber(record.grandTotal)
    ?? finiteNumber(record.amount);
  const total = taxBreakdown.length ? calculatedTotal : (storedTotal ?? calculatedTotal);

  return { subtotal, taxBreakdown, taxAmount, total };
}
