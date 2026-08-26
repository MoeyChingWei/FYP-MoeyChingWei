import { describe, expect, it } from "vitest";

import { workflowHtml } from "../routes/export.js";

const record = {
  companyName: "Our Company Sdn Bhd",
  companyAddress: "Our Company Address",
  sourceRequester: "Our Company Contact",
  supplierCompanyName: "Supplier Sdn Bhd",
  supplierEmail: "supplier@example.com",
  supplierAddress: "Supplier Address",
};

function partyCard(html, title) {
  const start = html.indexOf(`<h3>${title}</h3>`);
  const end = html.indexOf("</div></div>", start);
  return html.slice(start, end);
}

describe("workflow party direction", () => {
  it("renders supplier invoices from the supplier to our company", () => {
    const html = workflowHtml("supplier-invoice", { ...record, invoiceNumber: "INV-1" });

    expect(partyCard(html, "Sender")).toContain("Supplier Sdn Bhd");
    expect(partyCard(html, "Sender")).toContain("Supplier Address");
    expect(partyCard(html, "Receiver")).toContain("Our Company Sdn Bhd");
    expect(partyCard(html, "Receiver")).toContain("Our Company Address");
  });

  it("renders the supplier logo in the invoice sender card", () => {
    const html = workflowHtml("supplier-invoice", {
      ...record,
      invoiceNumber: "INV-1",
      supplierLogo: "data:image/png;base64,AA==",
    });

    expect(html).toContain('alt="Sender logo"');
    expect(html).toContain("data:image/png;base64,AA==");
  });

  it("keeps payment advice directed from our company to the supplier", () => {
    const html = workflowHtml("payment-advice", { ...record, paymentNumber: "PAY-1" });

    expect(partyCard(html, "Sender")).toContain("Our Company Sdn Bhd");
    expect(partyCard(html, "Receiver")).toContain("Supplier Sdn Bhd");
  });
});
