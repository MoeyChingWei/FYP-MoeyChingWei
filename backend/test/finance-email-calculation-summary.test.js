import { describe, expect, it } from "vitest";

import { renderEmailDocument } from "../services/emailNotifications.js";
import { workflowHtml } from "../routes/export.js";

const financeRecord = {
  currency: "MYR",
  invoiceNumber: "INV-TEST-001",
  paymentNumber: "PAY-TEST-001",
  supplierTaxApplies: true,
  supplierTaxRules: [{ taxType: "SALES_TAX", taxRate: 10 }],
  items: [{ itemName: "Safety Handbook", quantity: 5, unit: "pcs", unitPrice: 42 }],
  subtotal: 210,
  taxTotal: 21,
  grandTotal: 231,
  amountAfterTax: 231,
  amount: 231,
};

describe("finance calculation summaries", () => {
  it("shows the invoice subtotal, tax, and payable total in an email", () => {
    const rendered = renderEmailDocument({
      title: "Invoice approval",
      intro: "Review this invoice.",
      details: [],
      itemsRecord: financeRecord,
      calculationRecord: financeRecord,
      showCalculationSummary: true,
      action: "Review.",
    });

    expect(rendered.text).toContain("Items subtotal: RM 210.00");
    expect(rendered.text).toContain("Sales tax (10.00%): RM 21.00");
    expect(rendered.text).toContain("Total payable: RM 231.00");
  });

  it("shows the tax-backed paid amount in a payment advice PDF", () => {
    const html = workflowHtml("payment-advice", { ...financeRecord, items: [] }, "Payment Advice");

    expect(html).toContain("Payment summary");
    expect(html).toContain("Sales tax (10.00%)");
    expect(html).toContain("RM 21.00");
    expect(html).toContain("Paid amount");
    expect(html).toContain("RM 231.00");
  });
});
