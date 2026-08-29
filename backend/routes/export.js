import express from "express";
import prisma from "../config/prisma.js";
import { ExportService } from "../services/export-service.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { PDFGenerator } from "../services/pdf-generator.js";
import { formatCurrency, displayCurrency } from "../utils/currency.js";
import { calculateWorkflowTotals } from "../utils/workflow-totals.js";
import { formatPaymentTerm } from "../utils/payment-terms.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported data types and formats
const SUPPORTED_DATA_TYPES = ["purchase-requests", "purchase-orders", "invoices", "suppliers"];
const SUPPORTED_FORMATS = ["pdf", "excel", "csv", "json"];

const WORKFLOW_TYPES = {
  "purchase-request": "Purchase Request",
  "purchase-order": "Purchase Order",
  acknowledgement: "Order Acknowledgement",
  delivery: "Delivery Note",
  grn: "Goods Received Note",
};

// Finance documents use the same renderer internally for supplier-finance
// emails and downloads, but are intentionally not exposed through the generic
// /api/export/workflow endpoints because they contain sensitive payment data.
const FINANCE_WORKFLOW_TYPES = new Set(["supplier-invoice", "payment-advice"]);

const htmlEscape = (value) => String(value ?? "-")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;").replace(/'/g, "&#039;");

const logoMarkup = (source, alt) => {
  const value = String(source || "");
  if (!/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value)) return "";
  return `<img class="party-logo" src="${htmlEscape(value)}" alt="${htmlEscape(alt)}" />`;
};

export function workflowHtml(workflowType, record = {}, pageTitle) {
  const title = pageTitle || WORKFLOW_TYPES[workflowType] || (workflowType === "supplier-invoice"
    ? "Supplier Invoice Approval Summary"
    : workflowType === "payment-advice" ? "Payment Advice" : "Workflow Document");
  const items = Array.isArray(record.items) ? record.items : (record.lineItems || []);
  const number = FINANCE_WORKFLOW_TYPES.has(workflowType)
    ? (workflowType === "supplier-invoice" ? record.invoiceNumber : record.paymentNumber) || record.poNumber || record.localId
    : record.prNumber || record.poNumber || record.deliveryNo || record.localId;
  const status = record.status || "-";
  const companyName = record.companyName || "OptiMind";
  const companyContact = record.sourceRequester || record.createdBy || companyName;
  const supplierAddress = record.supplierAddress || record.supplier?.address || "-";
  const supplierName = record.supplierCompanyName || record.supplierName || "-";
  const companyLogo = record.companyLogo || "";
  const supplierLogo = record.supplierLogo || "";
  const isFinanceDocument = FINANCE_WORKFLOW_TYPES.has(workflowType);
  const isPartyDocument = ["acknowledgement", "delivery", "grn"].includes(workflowType) || isFinanceDocument;
  const currency = displayCurrency(record.currency);
  const { subtotal, taxBreakdown, total: totalAmount } = calculateWorkflowTotals(record);
  const rows = items.map((item, index) => {
    const imageUrl = item.itemImageUrl || item.imageUrl || item.image || item.imageDataUrl;
    const image = imageUrl
      ? `<img src="${htmlEscape(imageUrl)}" alt="${htmlEscape(item.itemName)}" style="width:42px;height:42px;object-fit:contain;display:block" />`
      : "-";
    const lineSubtotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    return `<tr><td>${index + 1}</td><td>${image}</td><td>${htmlEscape(item.itemName)}</td><td>${htmlEscape(item.itemDescription)}</td><td>${htmlEscape(item.quantity)}</td><td>${htmlEscape(item.unitOfMeasurement || item.unit)}</td><td class="amount">${htmlEscape(formatCurrency(item.unitPrice, currency))}</td><td class="amount">${htmlEscape(formatCurrency(lineSubtotal, currency))}</td></tr>`;
  }).join("");
  const maskAccount = (value) => {
    const account = String(value || "").trim();
    return account ? `****${account.slice(-4)}` : "Not provided";
  };
  const bank = record.bankDetails || {};
  const extra = {
    "purchase-request": [["Requester", record.requestBy], ["Department", record.department], ["Request date", record.requestDate], ["Currency", currency], ["Payment terms", formatPaymentTerm(record.paymentTerms)]],
    "purchase-order": [["Source PR", record.sourcePrNumber], ["Requester", record.sourceRequester], ["Department", record.department], ["Currency", currency], ["Payment terms", formatPaymentTerm(record.paymentTerms)]],
    acknowledgement: [["Sender (Company)", companyContact], ["Sender company", companyName], ["Sender address", record.companyAddress], ["Receiver (Supplier)", supplierName], ["Receiver email", record.supplierEmail], ["Receiver address", supplierAddress], ["Department", record.department]],
    delivery: [["Sender (Supplier)", supplierName], ["Sender email", record.supplierEmail], ["Sender address", supplierAddress], ["Receiver (Company)", companyContact], ["Receiver company", companyName], ["Receiver address", record.companyAddress], ["Delivery number", record.deliveryNo], ["Original PO", record.originalOrderNo || record.poNumber], ["Delivered date", record.deliveredDate]],
    grn: [["Sender (Supplier)", supplierName], ["Sender email", record.supplierEmail], ["Sender address", supplierAddress], ["Receiver (Company)", companyContact], ["Receiver company", companyName], ["Receiver address", record.companyAddress], ["Delivery number", record.deliveryNo], ["Original PO", record.originalOrderNo || record.poNumber], ["Completed date", record.completedDate], ["Discrepancy reason", record.discrepancyReason]],
    "supplier-invoice": [["Invoice number", record.invoiceNumber], ["Invoice date", record.invoiceDate], ["Purchase order", record.poNumber], ["GRN / delivery", record.deliveryNo], ["Supplier", supplierName], ["Supplier email", record.supplierEmail], ["Payment terms", formatPaymentTerm(record.paymentTerms)], ["Bank", bank.bankName || "Not provided"], ["Bank account", maskAccount(bank.accountNumber)], ["Currency", currency]],
    "payment-advice": [["Payment number", record.paymentNumber], ["Invoice number", record.invoiceNumber], ["Purchase order", record.poNumber], ["GRN / delivery", record.grnNumber || record.deliveryNo], ["Supplier", record.supplierName || supplierName], ["Supplier email", record.supplierEmail], ["Payment method", record.paymentMethod], ["Paid date", record.paidDate], ["Transaction reference", record.transactionReference], ["Processed by", record.processedBy], ["Bank", bank.bankName || "Not provided"], ["Bank account", maskAccount(bank.accountNumber)], ["Payment proof", record.attachmentName || "Not provided"], ["Currency", currency]],
  }[workflowType] || [];
  const partyInfo = isPartyDocument
    ? (workflowType === "acknowledgement"
      ? {
          sender: [["Company", companyName], ["Contact", companyContact], ["Address", record.companyAddress]],
          receiver: [["Supplier", supplierName], ["Email", record.supplierEmail], ["Address", supplierAddress]],
          senderLogo: companyLogo,
          receiverLogo: supplierLogo,
        }
      : isFinanceDocument
      ? (workflowType === "supplier-invoice"
        ? {
            sender: [["Supplier", supplierName || record.supplierName], ["Email", record.supplierEmail], ["Address", supplierAddress]],
            receiver: [["Company", companyName], ["Contact", companyContact], ["Address", record.companyAddress]],
            senderLogo: supplierLogo,
            receiverLogo: companyLogo,
          }
        : {
            sender: [["Company", companyName], ["Address", record.companyAddress]],
            receiver: [["Supplier", supplierName || record.supplierName], ["Email", record.supplierEmail], ["Address", supplierAddress]],
            senderLogo: companyLogo,
            receiverLogo: supplierLogo,
          })
      : {
          sender: [["Supplier", supplierName], ["Email", record.supplierEmail], ["Address", supplierAddress]],
          receiver: [["Company", companyName], ["Contact", companyContact], ["Address", record.companyAddress]],
          senderLogo: supplierLogo,
          receiverLogo: companyLogo,
        })
    : null;
  const renderPartyCard = (titleText, rows, logo, alt) => `<div class="party-card">${logoMarkup(logo, alt)}<h3>${titleText}</h3>${rows.map(([label, value]) => `<div class="party-row"><b>${htmlEscape(label)}</b><span>${htmlEscape(value)}</span></div>`).join("")}</div>`;
  const partyMarkup = partyInfo
    ? `<div class="party-grid">${renderPartyCard("Sender", partyInfo.sender, partyInfo.senderLogo, "Sender logo")}${renderPartyCard("Receiver", partyInfo.receiver, partyInfo.receiverLogo, "Receiver logo")}</div>`
    : "";
  const documentDetails = {
    acknowledgement: [["Department", record.department], ["Purchase order", record.poNumber], ["Source PR", record.sourcePrNumber], ["Payment terms", formatPaymentTerm(record.paymentTerms)]],
    delivery: [["Delivery number", record.deliveryNo], ["Original PO", record.originalOrderNo || record.poNumber], ["Delivered date", record.deliveredDate]],
    grn: [["Delivery number", record.deliveryNo], ["Original PO", record.originalOrderNo || record.poNumber], ["Completed date", record.completedDate], ["Discrepancy reason", record.discrepancyReason]],
    "supplier-invoice": [["Invoice number", record.invoiceNumber], ["Invoice date", record.invoiceDate], ["Purchase order", record.poNumber], ["GRN / delivery", record.deliveryNo], ["Approval status", status], ["Payment terms", formatPaymentTerm(record.paymentTerms)], ["Bank", bank.bankName || "Not provided"], ["Bank account", maskAccount(bank.accountNumber)]],
    "payment-advice": [["Payment number", record.paymentNumber], ["Invoice number", record.invoiceNumber], ["Purchase order", record.poNumber], ["GRN / delivery", record.grnNumber || record.deliveryNo], ["Payment status", status], ["Amount", formatCurrency(record.amount ?? record.totalAmount ?? 0, currency)], ["Bank", bank.bankName || "Not provided"], ["Bank account", maskAccount(bank.accountNumber)], ["Payment method", record.paymentMethod], ["Paid date", record.paidDate], ["Transaction reference", record.transactionReference], ["Processed by", record.processedBy], ["Payment proof", record.attachmentName || "Not provided"]],
  }[workflowType] || [];
  const generalMarkup = isPartyDocument
    ? `<div class="meta secondary-meta">${documentDetails.map(([label, value]) => `<b>${htmlEscape(label)}</b><span>${htmlEscape(value)}</span>`).join("")}</div>`
    : `<div class="meta">${extra.map(([label, value]) => `<b>${htmlEscape(label)}</b><span>${htmlEscape(value)}</span>`).join("")}</div>`;
  const historyMarkup = isFinanceDocument && Array.isArray(record.approvalHistory) && record.approvalHistory.length
    ? `<h2>${workflowType === "payment-advice" ? "Payment history" : "Approval history"}</h2><table><thead><tr><th>Action</th><th>By</th><th>Date</th><th>Reason / reference</th></tr></thead><tbody>${record.approvalHistory.map((entry) => `<tr><td>${htmlEscape(entry.action)}</td><td>${htmlEscape(entry.by)}</td><td>${htmlEscape(entry.date)}</td><td>${htmlEscape(entry.reason || entry.transactionReference || "-")}</td></tr>`).join("")}</tbody></table>`
    : (isFinanceDocument && record.rejectionReason ? `<h2>Rejection details</h2><div class="meta"><b>Rejected by</b><span>${htmlEscape(record.rejectedBy)}</span><b>Rejected date</b><span>${htmlEscape(record.rejectedDate)}</span><b>Reason</b><span>${htmlEscape(record.rejectionReason)}</span></div>` : "");
  const itemsMarkup = workflowType === "payment-advice" && !items.length
    ? ""
    : `<h2>Items</h2><table><thead><tr><th>No.</th><th>Image</th><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit price (${htmlEscape(currency)})</th><th>Line subtotal (${htmlEscape(currency)})</th></tr></thead><tbody>${rows || '<tr><td colspan="8">No items</td></tr>'}</tbody></table>`;
  const summaryTitle = workflowType === "payment-advice" ? "Payment summary" : "Calculation summary";
  const totalLabel = workflowType === "payment-advice" ? "Paid amount" : "Total payable";
  const totalsMarkup = `<section class="totals-block"><h2>${summaryTitle}</h2><div class="totals-row"><span>Items subtotal</span><strong>${htmlEscape(formatCurrency(subtotal, currency))}</strong></div>${taxBreakdown.map((tax) => `<div class="totals-row"><span>${htmlEscape(tax.rate == null ? tax.label : `${tax.label} (${tax.rate.toFixed(2)}%)`)}</span><strong>${htmlEscape(formatCurrency(tax.amount, currency))}</strong></div>`).join("")}${!taxBreakdown.length ? `<div class="totals-row muted-row"><span>Tax</span><strong>${htmlEscape(formatCurrency(0, currency))}</strong></div>` : ""}<div class="totals-row total-row"><span>${totalLabel}</span><strong>${htmlEscape(formatCurrency(totalAmount, currency))}</strong></div></section>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${htmlEscape(title)}</title><style>
    @page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#17202a;font-size:11px}.document-heading{display:grid;grid-template-columns:minmax(0,1fr) 180px;align-items:start;gap:24px;min-height:100px}.document-heading-copy{min-width:0;padding-top:3px}.header-brand{display:flex;justify-content:flex-end;align-items:flex-start;min-height:100px}.header-logo{width:150px;height:100px;object-fit:contain;display:block}h1{font-size:22px;margin:0 0 5px}h2{font-size:13px;margin:20px 0 7px;border-bottom:1px solid #ccd3da;padding-bottom:4px}.muted{color:#667085}.meta{display:grid;grid-template-columns:140px 1fr;gap:5px 12px;margin-top:16px}.meta b{color:#475467}.secondary-meta{padding-top:4px}.party-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.party-card{border:1px solid #d0d5dd;border-radius:3px;padding:10px;min-height:105px}.party-card h3{font-size:13px;margin:0 0 8px;padding-bottom:5px;border-bottom:1px solid #d0d5dd}.party-logo{width:52px;height:40px;object-fit:contain;display:block;margin-bottom:7px}.party-row{display:grid;grid-template-columns:70px 1fr;gap:8px;margin:4px 0}.party-row b{color:#475467}.party-row span{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #d0d5dd;padding:6px;text-align:left;vertical-align:top}th{background:#f2f4f7;font-weight:600}th.amount,td.amount{text-align:right;white-space:nowrap}.totals-block{width:52%;margin:18px 0 0 auto}.totals-row{display:flex;justify-content:space-between;gap:20px;padding:7px 10px;border-bottom:1px solid #eaecf0}.totals-row strong{white-space:nowrap}.muted-row{color:#667085}.total-row{margin-top:3px;border-top:2px solid #17202a;border-bottom:0;font-size:12px;font-weight:700;padding-top:9px}.footer{margin-top:24px;color:#667085;font-size:10px}
  </style></head><body><div class="document-heading"><div class="document-heading-copy"><h1>${htmlEscape(title)}</h1><div class="muted">Document: ${htmlEscape(number)} &nbsp; | &nbsp; Status: ${htmlEscape(status)}</div></div><div class="header-brand">${logoMarkup(companyLogo, "Company logo").replace('class="party-logo"', 'class="header-logo"')}</div></div><h2>${isPartyDocument ? "Parties & document information" : "Document information"}</h2>${partyMarkup}${generalMarkup}${itemsMarkup}${totalsMarkup}${historyMarkup}<div class="footer">Generated ${new Date().toLocaleString()}</div></body></html>`;
}

/**
 * Older workflow records only store the linked inventory ID. Resolve its image
 * at export time so existing acknowledgement, delivery, and GRN documents can
 * still show the product image.
 */
export async function hydrateWorkflowItemImages(record = {}) {
  const itemField = Array.isArray(record.items)
    ? "items"
    : (Array.isArray(record.lineItems) ? "lineItems" : null);
  if (!itemField) return record;

  const items = record[itemField];
  const inventoryIds = [...new Set(items
    .filter((item) => !item.itemImageUrl && !item.imageUrl && !item.image && !item.imageDataUrl)
    .map((item) => item.supplierInventoryItemId)
    .filter(Boolean))];
  if (!inventoryIds.length) return record;

  const inventoryItems = await prisma.supplierInventoryItem.findMany({
    where: { id: { in: inventoryIds } },
    select: { id: true, imageDataUrl: true },
  });
  const imageByInventoryId = new Map(
    inventoryItems
      .filter((item) => item.imageDataUrl)
      .map((item) => [item.id, item.imageDataUrl]),
  );

  if (!imageByInventoryId.size) return record;
  return {
    ...record,
    [itemField]: items.map((item) => {
      const imageDataUrl = imageByInventoryId.get(item.supplierInventoryItemId);
      return imageDataUrl ? { ...item, itemImageUrl: imageDataUrl } : item;
    }),
  };
}

/**
 * Supplier acknowledgement, delivery, and GRN rows created before company
 * logo support may not carry the logo themselves. Reuse the linked PO/PR
 * payload when exporting those legacy records.
 */
export async function hydrateWorkflowCompanyLogo(record = {}) {
  if (record.companyLogo) return record;

  const purchaseOrderId = record.poLocalId || record.purchaseOrderLocalId;
  if (purchaseOrderId) {
    const purchaseOrder = await prisma.purchaseOrderRecord.findUnique({
      where: { localId: purchaseOrderId },
      select: { payload: true },
    });
    const logo = purchaseOrder?.payload?.companyLogo;
    if (logo) return { ...record, companyLogo: logo };
  }

  const purchaseRequestId = record.sourceRequestLocalId || record.requestLocalId;
  if (purchaseRequestId) {
    const purchaseRequest = await prisma.purchaseRequestRecord.findUnique({
      where: { localId: purchaseRequestId },
      select: { payload: true },
    });
    const logo = purchaseRequest?.payload?.companyLogo;
    if (logo) return { ...record, companyLogo: logo };
  }

  return record;
}

router.post("/workflow/html", async (req, res) => {
  const { workflowType, record, pageTitle } = req.body || {};
  if (!WORKFLOW_TYPES[workflowType] || !record || typeof record !== "object") {
    return res.status(400).json({ success: false, message: "workflowType and record are required" });
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(workflowHtml(workflowType, await hydrateWorkflowItemImages(record), pageTitle));
});

router.post("/workflow", async (req, res) => {
  const { workflowType, record, pageTitle } = req.body || {};
  if (!WORKFLOW_TYPES[workflowType] || !record || typeof record !== "object") {
    return res.status(400).json({ success: false, message: "workflowType and record are required" });
  }
  const generator = new PDFGenerator();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const tempDir = path.join(process.cwd(), "temp", "exports");
  const outputPath = path.join(tempDir, `${workflowType}-${timestamp}.pdf`);
  try {
    await generator.generatePDF(
      workflowHtml(workflowType, await hydrateWorkflowItemImages(record), pageTitle),
      outputPath,
    );
    const fileBuffer = await fs.readFile(outputPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${workflowType}-${timestamp}.pdf"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error("Workflow PDF generation error:", error);
    res.status(500).json({ success: false, message: "Failed to generate workflow PDF" });
  } finally {
    await fs.rm(outputPath, { force: true }).catch(() => {});
    await generator.close().catch(() => {});
  }
});

/**
 * POST /api/export/:dataType
 * Export data in the requested format with filters and department-level permissions
 */
router.post("/:dataType", async (req, res) => {
  try {
    const { dataType } = req.params;
    const { format, filters = {}, userId, userRole, userDepartment } = req.body;

    // Validate dataType
    if (!SUPPORTED_DATA_TYPES.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type. Supported types: ${SUPPORTED_DATA_TYPES.join(", ")}`,
      });
    }

    // Validate format
    if (!format || !SUPPORTED_FORMATS.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `Invalid format. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`,
      });
    }

    // Validate user information (required for permission checks)
    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Query data based on dataType with filters and permissions
    let data;
    let recordCount = 0;

    try {
      switch (dataType) {
        case "purchase-requests":
          data = await queryPurchaseRequests(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "purchase-orders":
          data = await queryPurchaseOrders(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "invoices":
          // Note: Invoices are typically derived from purchase orders
          // This is a placeholder - adjust based on actual data model
          data = await queryInvoices(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "suppliers":
          data = await querySuppliers(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Unsupported data type",
          });
      }
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve data",
      });
    }

    // Check if data exists
    if (!data || recordCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No records found matching the criteria",
      });
    }

    // Generate export using ExportService
    const exportService = new ExportService();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const tempDir = path.join(process.cwd(), "temp", "exports");
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // For JSON format, export all data as array
      if (format === "json") {
        const outputPath = path.join(tempDir, `${dataType}-${timestamp}.json`);
        await exportService.exportToJSON(data, outputPath);

        // Read file and stream
        const fileBuffer = await fs.readFile(outputPath);

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${dataType}-${timestamp}.json"`
        );
        res.send(fileBuffer);

        // Clean up temp file
        await fs.unlink(outputPath);
        await exportService.close();
        return;
      }

      // For PDF, Excel, CSV - export first record as sample
      // In a real system, you might want to export multiple records or aggregate them
      if (recordCount > 1) {
        console.warn(
          `Multiple records found (${recordCount}). Exporting first record only for ${format} format.`
        );
      }

      const firstRecord = data[0];
      const dataTypeSingular = dataType.replace(/-/g, "-").slice(0, -1); // Remove trailing 's'

      let outputPath;
      let mimeType;
      let extension;

      switch (format) {
        case "pdf":
          extension = "pdf";
          mimeType = "application/pdf";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToPDF(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
              approvedBy: userRole === "Super Admin" ? "Super Admin" : undefined,
            }
          );
          break;

        case "excel":
          extension = "xlsx";
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToExcel(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
            }
          );
          break;

        case "csv":
          extension = "csv";
          mimeType = "text/csv; charset=utf-8";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToCSV(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
            }
          );
          break;

        default:
          await exportService.close();
          return res.status(400).json({
            success: false,
            message: "Unsupported format",
          });
      }

      // Read file and stream
      const fileBuffer = await fs.readFile(outputPath);

      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${dataType}-${timestamp}.${extension}"`
      );
      res.send(fileBuffer);

      // Clean up temp file
      await fs.unlink(outputPath);
      await exportService.close();
    } catch (exportError) {
      console.error("Export generation error:", exportError);
      await exportService.close();
      return res.status(500).json({
        success: false,
        message: `Failed to generate ${format} export: ${exportError.message}`,
      });
    }
  } catch (error) {
    console.error("Export API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * Query purchase requests with filters and department permissions
 */
async function queryPurchaseRequests(filters, userRole, userDepartment) {
  const where = {};

  // Build date filter
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.dateTo = new Date(filters.dateTo);
      where.createdAt.lte = new Date(where.dateTo.setHours(23, 59, 59, 999));
    }
  }

  // Fetch all records and filter by payload
  const records = await prisma.purchaseRequestRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Apply department-level permissions and filters
  return records.filter((record) => {
    const payload = record.payload;

    // Super Admin sees all, others see only their department
    if (userRole !== "Super Admin") {
      if (!userDepartment || payload.department !== userDepartment) {
        return false;
      }
    }

    // Apply status filter
    if (filters.status && payload.status !== filters.status) {
      return false;
    }

    // Apply department filter (for Super Admin)
    if (filters.department && payload.department !== filters.department) {
      return false;
    }

    return true;
  }).map(record => record.payload);
}

/**
 * Query purchase orders with filters and department permissions
 */
async function queryPurchaseOrders(filters, userRole, userDepartment) {
  const where = {};

  // Build date filter
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.dateTo = new Date(filters.dateTo);
      where.createdAt.lte = new Date(where.dateTo.setHours(23, 59, 59, 999));
    }
  }

  // Fetch all records and filter by payload
  const records = await prisma.purchaseOrderRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Apply department-level permissions and filters
  return records.filter((record) => {
    const payload = record.payload;

    // Super Admin sees all, others see only their department
    if (userRole !== "Super Admin") {
      if (!userDepartment || payload.department !== userDepartment) {
        return false;
      }
    }

    // Apply status filter
    if (filters.status && payload.status !== filters.status) {
      return false;
    }

    // Apply department filter (for Super Admin)
    if (filters.department && payload.department !== filters.department) {
      return false;
    }

    return true;
  }).map(record => record.payload);
}

/**
 * Query invoices with filters and department permissions
 * Note: This is a placeholder implementation
 */
async function queryInvoices(filters, userRole, userDepartment) {
  // Invoices are typically derived from purchase orders
  // This implementation treats purchase orders as invoices
  return await queryPurchaseOrders(filters, userRole, userDepartment);
}

/**
 * Query suppliers with filters and department permissions
 * Note: Suppliers are typically stored differently - adjust based on your schema
 */
async function querySuppliers(filters, userRole, userDepartment) {
  // This is a placeholder - suppliers might be stored in a separate table
  // For now, extracting unique suppliers from purchase orders
  const orders = await queryPurchaseOrders(filters, userRole, userDepartment);

  const suppliersMap = new Map();

  orders.forEach((order) => {
    if (order.supplier) {
      const supplierId = order.supplier.id || order.supplier.name;
      if (!suppliersMap.has(supplierId)) {
        suppliersMap.set(supplierId, {
          id: order.supplier.id,
          name: order.supplier.name,
          address: order.supplier.address,
          phone: order.supplier.phone,
          email: order.supplier.email,
          category: order.supplier.category,
        });
      }
    }
  });

  return Array.from(suppliersMap.values());
}

export default router;
