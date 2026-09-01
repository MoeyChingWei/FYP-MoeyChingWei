import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Prisma } from "../prisma/generated/prisma/client/index.js";

import prisma from "../config/prisma.js";
import { authenticateRequest, requireRoles } from "../middleware/auth.js";
import { ROLES } from "../constants/roles.js";
import { PDFGenerator } from "../services/pdf-generator.js";
import { renderEmailDocument, sendSystemNotificationEmail } from "../services/emailNotifications.js";
import { documentPdfFilename, hydrateWorkflowCompanyLogo, hydrateWorkflowItemImages, workflowHtml } from "./export.js";
import { formatCurrency } from "../utils/currency.js";

const router = express.Router();
// Resolve storage from this module's location. The backend is commonly started
// with `npm --prefix backend`, which preserves the project root as cwd.
const BACKEND_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UPLOAD_ROOT = path.join(BACKEND_ROOT, "uploads");
const FINANCE_ROLES = [ROLES.ADMIN, ROLES.TREASURY_FINANCE_OFFICER];
const PAYMENT_ROLES = [ROLES.ADMIN, ROLES.PAYMENT_TEAM];
const PROOF_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_PROOF_BYTES = 5 * 1024 * 1024;

router.use(authenticateRequest);

function money(value, currency = "RM") {
  return formatCurrency(value, currency);
}

function displayAccount(value) {
  const account = String(value || "").trim();
  return account || "Not provided";
}

function calculateTotals(items, orderTax = {}) {
  if (!Array.isArray(items) || !items.length) throw new Error("Invoice must contain at least one item");
  let subtotal = 0;
  let taxTotal = 0;
  const normalizedItems = items.map((item) => {
    const quantity = Number(item?.quantity);
    const unitPrice = Number(item?.unitPrice);
    const taxRate = Number(item?.taxRate || 0);
    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(taxRate) || taxRate < 0) {
      throw new Error("Invoice contains an invalid quantity, unit price, or tax rate");
    }
    const lineSubtotal = quantity * unitPrice;
    const taxAmount = Math.round(lineSubtotal * taxRate) / 100;
    subtotal += lineSubtotal;
    taxTotal += taxAmount;
    return { ...item, quantity, unitPrice, taxRate, taxAmount, lineTotal: lineSubtotal + taxAmount };
  });
  const supplierTaxApplies = Boolean(orderTax?.supplierTaxApplies);
  const configuredTaxRules = Array.isArray(orderTax?.supplierTaxRules)
    ? orderTax.supplierTaxRules.map((rule) => ({
      taxType: String(rule?.taxType ?? rule?.code ?? "TAX").trim().toUpperCase(),
      taxRate: Number(rule?.taxRate ?? rule?.rate ?? 0),
    })).filter((rule) => Number.isFinite(rule.taxRate) && rule.taxRate >= 0)
    : [];
  const legacyTaxRules = [{
    taxType: String(orderTax?.supplierTaxType ?? "TAX").trim().toUpperCase(),
    taxRate: Number(orderTax?.supplierTaxRate ?? 0),
  }];
  if (supplierTaxApplies) {
    const taxRules = configuredTaxRules.length ? configuredTaxRules : legacyTaxRules;
    taxTotal = taxRules.reduce((sum, rule) => sum + Math.round(subtotal * rule.taxRate) / 100, 0);
    normalizedItems.forEach((item) => {
      item.taxRate = 0;
      item.taxAmount = 0;
      item.lineTotal = Number((item.quantity * item.unitPrice).toFixed(2));
    });
  }
  return {
    items: normalizedItems,
    subtotal: Number(subtotal.toFixed(2)),
    taxTotal: Number(taxTotal.toFixed(2)),
    grandTotal: Number((subtotal + taxTotal).toFixed(2)),
  };
}

function isValidIsoDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function invoiceIdForGrn(grnLocalId) {
  return `supplier-invoice-${String(grnLocalId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function appendHistory(record, action, actor, reason) {
  const history = Array.isArray(record.approvalHistory) ? record.approvalHistory : [];
  return [...history, { action, by: actor.name || actor.email, role: actor.role, date: new Date().toISOString(), ...(reason ? { reason } : {}) }];
}

async function getInvoice(localId) {
  const record = await prisma.supplierInvoiceRecordStore.findUnique({ where: { localId }, select: { localId: true, payload: true } });
  return record ? hydrateWorkflowSupplierLogo({ localId: record.localId, ...(record.payload || {}) }) : null;
}

async function getPayment(localId) {
  const record = await prisma.supplierPaymentRecordStore.findUnique({ where: { localId }, select: { localId: true, payload: true } });
  return record ? hydratePaymentFinancialDetails({ localId: record.localId, ...(record.payload || {}) }) : null;
}

// Payment records created before the finance email enhancement only stored a
// final amount. Recover the invoice calculation so older payment advice and
// completion emails can also show subtotal and tax formally.
async function hydratePaymentFinancialDetails(payment = {}) {
  if ((Number.isFinite(Number(payment.subtotal)) && payment.sourceRequester && payment.companyLogo) || !payment.invoiceLocalId) return payment;
  const invoice = await getInvoice(payment.invoiceLocalId);
  if (!invoice) return payment;
  const hydratedInvoice = await hydrateWorkflowCompanyLogo(invoice);
  return {
    ...payment,
    items: invoice.items,
    subtotal: invoice.subtotal,
    taxTotal: invoice.taxTotal,
    grandTotal: invoice.grandTotal,
    amountAfterTax: invoice.amountAfterTax ?? invoice.grandTotal,
    supplierTaxApplies: invoice.supplierTaxApplies,
    supplierTaxType: invoice.supplierTaxType,
    supplierTaxRate: invoice.supplierTaxRate,
    supplierTaxRules: invoice.supplierTaxRules,
    supplierCompanyName: payment.supplierCompanyName || invoice.supplierCompanyName,
    supplierAddress: payment.supplierAddress || invoice.supplierAddress,
    sourceRequester: payment.sourceRequester || invoice.sourceRequester,
    supplierLogo: payment.supplierLogo || invoice.supplierLogo,
    companyName: payment.companyName || invoice.companyName,
    companyAddress: payment.companyAddress || invoice.companyAddress,
    companyLogo: payment.companyLogo || hydratedInvoice.companyLogo,
  };
}

function isOwnInvoice(invoice, user) {
  return invoice && (Number(invoice.supplierId) === Number(user.id) || String(invoice.supplierEmail || "").toLowerCase() === String(user.email || "").toLowerCase());
}

async function saveInvoice(invoice) {
  const updatedAt = new Date();
  await prisma.supplierInvoiceRecordStore.update({ where: { localId: invoice.localId }, data: { payload: invoice, updatedAt } });
  return invoice;
}

async function savePayment(payment) {
  await prisma.supplierPaymentRecordStore.update({ where: { localId: payment.localId }, data: { payload: payment, updatedAt: new Date() } });
  return payment;
}

async function recipientsFor(roles) {
  return prisma.user.findMany({ where: { role: { in: roles }, isActive: true }, select: { id: true, email: true, name: true } });
}

async function supplierRecipient(record) {
  const email = String(record?.supplierEmail || "").trim();
  const supplierId = Number(record?.supplierId);
  const conditions = [];
  if (email) conditions.push({ email: { equals: email, mode: "insensitive" } });
  if (Number.isInteger(supplierId) && supplierId > 0) conditions.push({ id: supplierId });
  if (!conditions.length) return null;
  return prisma.user.findFirst({
    where: { role: ROLES.SUPPLIER, isActive: true, OR: conditions },
    select: { id: true, email: true, name: true },
  });
}

async function notify(users, payload) {
  if (!users.length) return;
  await prisma.notification.createMany({ data: users.map((user) => ({ userId: user.id, ...payload })) }).catch((error) => console.error("Supplier finance notification failed:", error.message));
}

function isOwnPayment(payment, user) {
  return payment && (Number(payment.supplierId) === Number(user.id) || String(payment.supplierEmail || "").toLowerCase() === String(user.email || "").toLowerCase());
}

function invoicePdfHtml(invoice) {
  return workflowHtml("supplier-invoice", invoice, "Supplier Invoice Approval Summary");
}

function paymentPdfHtml(payment) {
  return workflowHtml("payment-advice", payment, "Payment Advice");
}

function validCompanyLogo(value) {
  const source = String(value || "");
  return /^data:image\/(?:png|jpe?g|webp|gif|svg\+xml);base64,[A-Za-z0-9+/]*={0,2}$/i.test(source) ? source : "";
}

async function generatePdf(kind, record, requestedCompanyLogo = "") {
  const number = String(kind === "invoice" ? record.invoiceNumber : record.paymentNumber).replace(/[^a-zA-Z0-9-]/g, "_");
  const filename = kind === "invoice" ? `supplier-invoice-approval-summary-${number}.pdf` : `payment-advice-${number}.pdf`;
  const relativePath = path.join("supplier-finance", filename);
  const outputPath = path.join(UPLOAD_ROOT, relativePath);
  const generator = new PDFGenerator();
  try {
    await generator.generatePDF(await financeDocumentHtml(kind, record, requestedCompanyLogo), outputPath);
    return { filename, path: relativePath };
  } finally {
    await generator.close().catch(() => {});
  }
}

async function financeDocumentHtml(kind, record, requestedCompanyLogo = "") {
  const withLogo = await hydrateWorkflowCompanyLogo(record);
  const withSupplierLogo = await hydrateWorkflowSupplierLogo(withLogo);
  const hydrated = await hydrateWorkflowItemImages(withSupplierLogo);
  const currentLogo = validCompanyLogo(requestedCompanyLogo);
  const latest = currentLogo ? { ...hydrated, companyLogo: currentLogo } : hydrated;
  return kind === "invoice" ? invoicePdfHtml(latest) : paymentPdfHtml(latest);
}

// Older invoice rows were created without copying the supplier logo from the
// received GRN. Recover it from that linked workflow record before rendering.
async function hydrateWorkflowSupplierLogo(record = {}) {
  if (record.supplierLogo) return record;
  if (record.grnLocalId) {
    const grn = await prisma.supplierGrnRecordStore.findUnique({
      where: { localId: record.grnLocalId },
      select: { payload: true },
    });
    const logo = grn?.payload?.supplierLogo;
    if (logo) return { ...record, supplierLogo: logo };
  }
  return record;
}

async function bestEffortInvoicePdf(invoice) {
  try { const pdf = await generatePdf("invoice", invoice); invoice.invoicePdf = pdf; await saveInvoice(invoice); return pdf; }
  catch (error) { console.error("Supplier invoice PDF generation failed:", error.message); return null; }
}

async function bestEffortPaymentPdf(payment) {
  try { const pdf = await generatePdf("payment", payment); payment.paymentAdvicePdf = pdf; await savePayment(payment); return pdf; }
  catch (error) { console.error("Payment advice PDF generation failed:", error.message); return null; }
}

function emailDocument(title, message, invoice, extra = []) {
  const isPayment = Boolean(invoice.paymentNumber);
  const details = [["Status", invoice.status], ["Invoice number", invoice.invoiceNumber], ["Payment number", invoice.paymentNumber], ["Supplier", invoice.supplierCompanyName || invoice.supplierName], ["PO / GRN", `${invoice.poNumber || "-"} / ${invoice.deliveryNo || invoice.grnNumber || "-"}`], [isPayment ? "Paid amount" : "Invoice amount", money(invoice.grandTotal ?? invoice.amount, invoice.currency)], ...extra];
  const rendered = renderEmailDocument({
    title,
    intro: message,
    details,
    itemsRecord: Array.isArray(invoice.items) && invoice.items.length ? invoice : null,
    calculationRecord: invoice,
    total: invoice.grandTotal ?? invoice.amount,
    showCalculationSummary: true,
    action: "Please sign in to OptiMind ERP to review the document and continue the workflow.",
  });
  return { subject: title, text: rendered.text, html: rendered.html, attachments: rendered.attachments };
}

async function email(to, document, attachment) {
  if (!to.length) return;
  const attachments = [
    ...(Array.isArray(document?.attachments) ? document.attachments : []),
    ...(attachment ? [{ filename: attachment.filename, path: path.join(UPLOAD_ROOT, attachment.path), contentType: "application/pdf" }] : []),
  ];
  // Email delivery is external I/O. Queue it after the state transition so a
  // slow SMTP/Gmail connection cannot roll back or time out the ERP workflow.
  void sendSystemNotificationEmail({ to, ...document, attachments })
    .catch((error) => console.error("Supplier finance email failed:", error.message));
}

router.get("/bank-details", requireRoles([ROLES.SUPPLIER, ROLES.ADMIN]), async (req, res) => {
  try {
    const rows = await prisma.$queryRaw`SELECT "bankName", "accountName", "accountNumber" FROM "supplier_bank_details" WHERE "supplierId" = ${req.user.id}`;
    return res.json({ success: true, bankDetails: rows[0] || { bankName: "", accountName: "", accountNumber: "" } });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to load bank details" }); }
});

router.put("/bank-details", requireRoles([ROLES.SUPPLIER, ROLES.ADMIN]), async (req, res) => {
  const bankName = String(req.body?.bankName || "").trim();
  const accountName = String(req.body?.accountName || "").trim();
  const accountNumber = String(req.body?.accountNumber || "").trim();
  if (accountNumber && !/^[A-Za-z0-9 -]{4,50}$/.test(accountNumber)) return res.status(400).json({ success: false, message: "Invalid bank account number" });
  try {
    await prisma.$executeRaw`INSERT INTO "supplier_bank_details" ("supplierId", "bankName", "accountName", "accountNumber", "updatedAt") VALUES (${req.user.id}, ${bankName || null}, ${accountName || null}, ${accountNumber || null}, NOW()) ON CONFLICT ("supplierId") DO UPDATE SET "bankName" = EXCLUDED."bankName", "accountName" = EXCLUDED."accountName", "accountNumber" = EXCLUDED."accountNumber", "updatedAt" = NOW()`;
    return res.json({ success: true, bankDetails: { bankName, accountName, accountNumber } });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to save bank details" }); }
});

router.get("/invoices", requireRoles([...FINANCE_ROLES, ROLES.SUPPLIER]), async (req, res) => {
  try {
    const records = await prisma.supplierInvoiceRecordStore.findMany({ orderBy: { updatedAt: "desc" }, select: { localId: true, payload: true } });
    const invoices = await Promise.all(records.map((record) => hydrateWorkflowSupplierLogo({ localId: record.localId, ...(record.payload || {}) })));
    return res.json({ success: true, invoices: req.user.role === ROLES.SUPPLIER ? invoices.filter((invoice) => isOwnInvoice(invoice, req.user)) : invoices });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to load supplier invoices" }); }
});

router.get("/payments", requireRoles([...PAYMENT_ROLES, ROLES.SUPPLIER]), async (req, res) => {
  try {
    const records = await prisma.supplierPaymentRecordStore.findMany({ orderBy: { updatedAt: "desc" }, select: { localId: true, payload: true } });
    const payments = records.map((record) => ({ localId: record.localId, ...(record.payload || {}) }));
    return res.json({ success: true, payments: req.user.role === ROLES.SUPPLIER ? payments.filter((payment) => isOwnPayment(payment, req.user)) : payments });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to load supplier payments" }); }
});

router.post("/invoices/from-grn", requireRoles([ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.DEPARTMENT_EXECUTIVE, ROLES.MANAGER]), async (req, res) => {
  const grn = req.body?.grn;
  if (!grn || !grn.localId || !["RECEIVED", "COMPLETED"].includes(grn.status)) return res.status(400).json({ success: false, message: "A received GRN is required" });
  try {
    const candidates = await prisma.supplierInvoiceRecordStore.findMany({ select: { payload: true } });
    const existing = candidates.map((row) => row.payload).find((row) => row?.grnLocalId === grn.localId);
    if (existing) return res.json({ success: true, invoice: await hydrateWorkflowSupplierLogo(existing), created: false });
    const totals = calculateTotals(grn.items, grn);
    const today = new Date();
    const invoice = { localId: invoiceIdForGrn(grn.localId), invoiceNumber: `INV-${today.toISOString().slice(0, 10).replace(/-/g, "")}-${String(today.getTime()).slice(-5)}`, invoiceDate: grn.completedDate || grn.createdDate, grnLocalId: grn.localId, deliveryNo: grn.deliveryNo, poLocalId: grn.poLocalId, poNumber: grn.poNumber, sourcePrNumber: grn.sourcePrNumber, sourceRequester: grn.sourceRequester, createdDate: today.toISOString(), supplierId: grn.supplierId, supplierName: grn.supplierName, supplierCompanyName: grn.supplierCompanyName, supplierLogo: grn.supplierLogo, supplierEmail: grn.supplierEmail, supplierAddress: grn.supplierAddress, currency: grn.currency || "MYR", paymentTerms: grn.paymentTerms, supplierTaxApplies: grn.supplierTaxApplies, supplierTaxType: grn.supplierTaxType, supplierTaxRate: grn.supplierTaxRate, supplierTaxRules: grn.supplierTaxRules, companyName: grn.companyName || "OptiMind ERP", companyLogo: grn.companyLogo, companyAddress: grn.companyAddress, status: "DRAFT", ...totals, amountAfterTax: totals.grandTotal, approvalHistory: [] };
    try {
      await prisma.supplierInvoiceRecordStore.create({ data: { localId: invoice.localId, payload: invoice, updatedAt: today } });
      return res.status(201).json({ success: true, invoice, created: true });
    } catch (createError) {
      // The stable GRN-derived ID makes concurrent received-GRN events converge
      // on one invoice even when both requests pass the initial lookup.
      if (createError?.code === "P2002") {
        const concurrent = await getInvoice(invoice.localId);
        if (concurrent) return res.json({ success: true, invoice: concurrent, created: false });
      }
      throw createError;
    }
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "Unable to create supplier invoice" }); }
});

router.post("/invoices/:localId/submit", requireRoles([ROLES.SUPPLIER, ROLES.ADMIN]), async (req, res) => {
  try {
    const invoice = await getInvoice(req.params.localId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    if (req.user.role === ROLES.SUPPLIER && !isOwnInvoice(invoice, req.user)) return res.status(403).json({ success: false, message: "You can only submit your own invoice" });
    if (!["DRAFT", "REJECTED"].includes(invoice.status)) return res.status(409).json({ success: false, message: "Only draft or rejected invoices can be submitted" });
    const bankRows = await prisma.$queryRaw`SELECT "bankName", "accountName", "accountNumber" FROM "supplier_bank_details" WHERE "supplierId" = ${Number(invoice.supplierId || req.user.id)}`;
    const totals = calculateTotals(invoice.items, invoice);
    const now = new Date().toISOString();
    Object.assign(invoice, totals, { status: "SUBMITTED", submittedDate: now, reviewedDate: undefined, reviewedBy: undefined, rejectionReason: undefined, rejectedDate: undefined, rejectedBy: undefined, bankDetails: bankRows[0] || {}, approvalHistory: appendHistory(invoice, invoice.status === "REJECTED" ? "RESUBMITTED" : "SUBMITTED", req.user) });
    await saveInvoice(invoice);
    const pdf = await bestEffortInvoicePdf(invoice);
    const finance = await recipientsFor([ROLES.TREASURY_FINANCE_OFFICER]);
    await notify(finance, { title: "Supplier Invoice Pending Approval", message: `${invoice.invoiceNumber} requires Finance approval.`, type: "SUPPLIER_INVOICE_APPROVAL", refType: "supplier-invoice", refId: invoice.localId });
    const document = emailDocument(`[OptiMind ERP] Supplier Invoice Pending Approval - ${invoice.invoiceNumber}`, "Supplier Invoice has been submitted. Review, approve or reject it in OptiMind ERP.", invoice, [["Supplier bank account", displayAccount(invoice.bankDetails?.accountNumber)]]);
    await email(finance.map((user) => user.email), document, pdf);
    return res.json({ success: true, invoice });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "Unable to submit invoice" }); }
});

router.post("/invoices/:localId/approve", requireRoles(FINANCE_ROLES), async (req, res) => {
  try {
    const invoice = await getInvoice(req.params.localId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    if (invoice.status !== "SUBMITTED") return res.status(409).json({ success: false, message: "Only submitted invoices can be approved" });
    const totals = calculateTotals(invoice.items, invoice);
    const now = new Date();
    const paymentLocalId = `payment-${invoice.localId}`;
    const paymentNumber = `PAY-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${invoice.localId.replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase()}`;
    const approvedInvoice = { ...invoice, ...totals, status: "APPROVED", reviewedDate: now.toISOString(), approvedDate: now.toISOString(), reviewedBy: req.user.name || req.user.email, approvedBy: req.user.name || req.user.email, rejectionReason: undefined, approvalHistory: appendHistory(invoice, "APPROVED", req.user) };
  const payment = { localId: paymentLocalId, paymentNumber, invoiceLocalId: invoice.localId, invoiceNumber: invoice.invoiceNumber, poNumber: invoice.poNumber, grnNumber: invoice.deliveryNo, supplierId: invoice.supplierId, supplierName: invoice.supplierCompanyName || invoice.supplierName, supplierCompanyName: invoice.supplierCompanyName, supplierEmail: invoice.supplierEmail, supplierAddress: invoice.supplierAddress, supplierLogo: invoice.supplierLogo, sourceRequester: invoice.sourceRequester, companyName: invoice.companyName, companyAddress: invoice.companyAddress, companyLogo: invoice.companyLogo, bankDetails: invoice.bankDetails || {}, items: totals.items, subtotal: totals.subtotal, taxTotal: totals.taxTotal, grandTotal: totals.grandTotal, amountAfterTax: totals.grandTotal, supplierTaxApplies: invoice.supplierTaxApplies, supplierTaxType: invoice.supplierTaxType, supplierTaxRate: invoice.supplierTaxRate, supplierTaxRules: invoice.supplierTaxRules, amount: totals.grandTotal, currency: invoice.currency, paymentTerms: invoice.paymentTerms, invoiceDate: invoice.invoiceDate, createdDate: now.toISOString(), updatedDate: now.toISOString(), status: "PENDING_PAYMENT", paymentHistory: [{ action: "CREATED", by: req.user.name || req.user.email, date: now.toISOString() }] };
    await prisma.$transaction(async (tx) => {
      const current = await tx.supplierInvoiceRecordStore.findUnique({ where: { localId: invoice.localId }, select: { payload: true } });
      if (!current || current.payload?.status !== "SUBMITTED") throw new Error("Invoice was already processed");
      await tx.supplierInvoiceRecordStore.update({ where: { localId: invoice.localId }, data: { payload: approvedInvoice, updatedAt: now } });
      await tx.supplierPaymentRecordStore.upsert({ where: { localId: paymentLocalId }, update: {}, create: { localId: paymentLocalId, payload: payment, updatedAt: now } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    const pdf = await bestEffortInvoicePdf(approvedInvoice);
    const supplierUser = await supplierRecipient(invoice);
    if (supplierUser) await notify([supplierUser], { title: "Supplier Invoice Approved", message: `${invoice.invoiceNumber} was approved and forwarded to the Payment Team.`, type: "SUPPLIER_UPDATE", refType: "supplier-invoice", refId: invoice.localId });
    const paymentTeam = await recipientsFor([ROLES.PAYMENT_TEAM]);
    await notify(paymentTeam, { title: "Payment Pending Processing", message: `${payment.paymentNumber} is ready for payment processing.`, type: "SUPPLIER_PAYMENT_PENDING", refType: "supplier-payment", refId: payment.localId });
    if (supplierUser) await notify([supplierUser], { title: "Supplier Payment Pending", message: `${payment.paymentNumber} for ${payment.invoiceNumber} is pending Payment Team processing (${money(payment.grandTotal ?? payment.amount, payment.currency)}).`, type: "SUPPLIER_PAYMENT_PENDING", refType: "supplier-payment", refId: payment.localId });
    if (supplierUser) await email([supplierUser.email], emailDocument(`[OptiMind ERP] Supplier Invoice Approved - ${invoice.invoiceNumber}`, "Your supplier invoice has been approved by Finance and has been forwarded to the Payment Team for payment processing.", approvedInvoice, [["Approved by", approvedInvoice.approvedBy], ["Current status", "Approved / Pending Payment"]]), pdf);
    await email(paymentTeam.map((user) => user.email), emailDocument(`[OptiMind ERP] Payment Pending Processing - ${payment.paymentNumber}`, "Payment is pending processing. Open Finance > Payment Processing to complete it.", approvedInvoice, [["Payment number", payment.paymentNumber], ["Payment status", "PENDING_PAYMENT"]]), pdf);
    return res.json({ success: true, invoice: approvedInvoice, payment });
  } catch (error) { return res.status(409).json({ success: false, message: error.message || "Unable to approve invoice" }); }
});

router.post("/invoices/:localId/reject", requireRoles(FINANCE_ROLES), async (req, res) => {
  const reason = String(req.body?.reason || "").trim();
  if (!reason) return res.status(400).json({ success: false, message: "Rejection reason is required" });
  try {
    const invoice = await getInvoice(req.params.localId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    if (invoice.status !== "SUBMITTED") return res.status(409).json({ success: false, message: "Only submitted invoices can be rejected" });
    Object.assign(invoice, calculateTotals(invoice.items, invoice), { status: "REJECTED", reviewedDate: new Date().toISOString(), rejectedDate: new Date().toISOString(), reviewedBy: req.user.name || req.user.email, rejectedBy: req.user.name || req.user.email, rejectionReason: reason, approvalHistory: appendHistory(invoice, "REJECTED", req.user, reason) });
    await saveInvoice(invoice);
    const pdf = await bestEffortInvoicePdf(invoice);
    const supplier = await supplierRecipient(invoice);
    if (supplier) { await notify([supplier], { title: "Supplier Invoice Rejected", message: `${invoice.invoiceNumber} was rejected. Reason: ${reason}`, type: "SUPPLIER_UPDATE", refType: "supplier-invoice", refId: invoice.localId }); await email([supplier.email], emailDocument(`[OptiMind ERP] Supplier Invoice Rejected - ${invoice.invoiceNumber}`, "Your supplier invoice was rejected. Update the information and resubmit it.", invoice, [["Rejected by", invoice.rejectedBy], ["Rejection reason", reason]]), pdf); }
    return res.json({ success: true, invoice });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "Unable to reject invoice" }); }
});

router.post("/payments/:localId/process", requireRoles(PAYMENT_ROLES), async (req, res) => {
  const paymentMethod = String(req.body?.paymentMethod || "").trim();
  const paidDate = String(req.body?.paidDate || "").trim();
  const transactionReference = String(req.body?.transactionReference || "").trim();
  const attachment = req.body?.attachment;
  if (!paymentMethod || !isValidIsoDate(paidDate) || !transactionReference) return res.status(400).json({ success: false, message: "Payment method, valid paid date and transaction reference are required" });
  const dataUrlPattern = typeof attachment?.attachmentDataUrl === "string"
    ? attachment.attachmentDataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/)
    : null;
  if (!attachment?.attachmentName || !PROOF_TYPES.has(attachment.attachmentType) || !dataUrlPattern || dataUrlPattern[1].toLowerCase() !== String(attachment.attachmentType).toLowerCase() || !dataUrlPattern[2]) return res.status(400).json({ success: false, message: "A PDF, JPG, or PNG payment proof is required" });
  const encoded = dataUrlPattern[2];
  if (Buffer.byteLength(encoded, "base64") > MAX_PROOF_BYTES) return res.status(400).json({ success: false, message: "Payment proof must be 5MB or smaller" });
  try {
    const payment = await getPayment(req.params.localId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    const processedPayment = { ...payment, status: "PAID", paymentMethod, paidDate, transactionReference, processedBy: req.user.name || req.user.email, remarks: String(req.body?.remarks || "").trim() || undefined, ...attachment, updatedDate: new Date().toISOString(), paymentHistory: [...(payment.paymentHistory || []), { action: "PAID", by: req.user.name || req.user.email, date: new Date().toISOString(), transactionReference }] };
    await prisma.$transaction(async (tx) => {
      const current = await tx.supplierPaymentRecordStore.findUnique({ where: { localId: payment.localId }, select: { payload: true } });
      if (!current) throw Object.assign(new Error("Payment not found"), { statusCode: 404 });
      if (current.payload?.status !== "PENDING_PAYMENT") throw Object.assign(new Error("Only pending payments can be processed"), { statusCode: 409 });
      await tx.supplierPaymentRecordStore.update({ where: { localId: payment.localId }, data: { payload: processedPayment, updatedAt: new Date() } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    Object.assign(payment, processedPayment);
    const pdf = await bestEffortPaymentPdf(payment);
    const supplier = await supplierRecipient(payment);
    if (supplier) { await notify([supplier], { title: "Supplier Payment Completed", message: `${payment.paymentNumber} has been paid.`, type: "SUPPLIER_PAYMENT_COMPLETED", refType: "supplier-payment", refId: payment.localId }); await email([supplier.email], emailDocument(`[OptiMind ERP] Payment Completed - ${payment.paymentNumber}`, "Your payment has been completed.", payment, [["Payment number", payment.paymentNumber], ["Payment method", paymentMethod], ["Paid date", paidDate], ["Transaction reference", transactionReference], ["Processed by", payment.processedBy], ["Bank account", displayAccount(payment.bankDetails?.accountNumber)], ["Payment proof", payment.attachmentName]]), pdf); }
    return res.json({ success: true, payment });
  } catch (error) { return res.status(error.statusCode || (error.code === "P2034" ? 409 : 400)).json({ success: false, message: error.message || "Unable to process payment" }); }
});

async function downloadPdf(req, res, kind) {
  try {
    const record = kind === "invoice" ? await getInvoice(req.params.localId) : await getPayment(req.params.localId);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    const own = kind === "invoice" ? isOwnInvoice(record, req.user) : (Number(record.supplierId) === Number(req.user.id) || String(record.supplierEmail || "").toLowerCase() === String(req.user.email || "").toLowerCase());
    if (!own && ![...FINANCE_ROLES, ...PAYMENT_ROLES].includes(req.user.role)) return res.status(403).json({ success: false, message: "Access denied" });
    const field = kind === "invoice" ? "invoicePdf" : "paymentAdvicePdf";
    const resolvePdfPath = (pdf) => {
      if (!pdf?.path) return null;
      // Normalize paths persisted by older Windows builds before resolving.
      const normalizedPath = String(pdf.path).replace(/[\\/]+/g, path.sep);
      const diskPath = path.resolve(UPLOAD_ROOT, normalizedPath);
      const relative = path.relative(UPLOAD_ROOT, diskPath);
      if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;
      return diskPath;
    };
    // Regenerate on download so exported documents reflect the latest workflow
    // details, including logos recovered from their linked GRN records.
    const requestedCompanyLogo = validCompanyLogo(req.body?.companyLogo);
    record[field] = await generatePdf(kind, record, requestedCompanyLogo);
    await (kind === "invoice" ? saveInvoice(record) : savePayment(record));
    let diskPath = resolvePdfPath(record[field]);
    if (!diskPath) return res.status(400).json({ success: false, message: "Invalid PDF path" });
    try {
      await fs.access(diskPath);
    } catch {
      record[field] = await generatePdf(kind, record, requestedCompanyLogo);
      await (kind === "invoice" ? saveInvoice(record) : savePayment(record));
      diskPath = resolvePdfPath(record[field]);
      if (!diskPath) return res.status(400).json({ success: false, message: "Invalid PDF path" });
      await fs.access(diskPath);
    }
    // Keep the persisted storage name for backwards compatibility, while
    // exposing the same predictable download name used by workflow exports.
    return res.download(diskPath, documentPdfFilename(kind === "invoice" ? "supplier-invoice" : "payment-advice", record));
  } catch (error) {
    console.error("Supplier finance PDF download failed:", error.message);
    return res.status(404).json({ success: false, message: "PDF is not available" });
  }
}

async function printHtml(req, res, kind) {
  try {
    const record = kind === "invoice" ? await getInvoice(req.params.localId) : await getPayment(req.params.localId);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    const own = kind === "invoice" ? isOwnInvoice(record, req.user) : isOwnPayment(record, req.user);
    if (!own && ![...FINANCE_ROLES, ...PAYMENT_ROLES].includes(req.user.role)) return res.status(403).json({ success: false, message: "Access denied" });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(await financeDocumentHtml(kind, record, req.body?.companyLogo));
  } catch (error) {
    console.error("Supplier finance print document failed:", error.message);
    return res.status(404).json({ success: false, message: "Print document is not available" });
  }
}

router.get("/invoices/:localId/print", requireRoles([...FINANCE_ROLES, ROLES.SUPPLIER]), (req, res) => printHtml(req, res, "invoice"));
router.get("/payments/:localId/print", requireRoles([...PAYMENT_ROLES, ROLES.SUPPLIER]), (req, res) => printHtml(req, res, "payment"));
router.post("/invoices/:localId/print", requireRoles([...FINANCE_ROLES, ROLES.SUPPLIER]), (req, res) => printHtml(req, res, "invoice"));
router.post("/payments/:localId/print", requireRoles([...PAYMENT_ROLES, ROLES.SUPPLIER]), (req, res) => printHtml(req, res, "payment"));
router.get("/invoices/:localId/pdf", requireRoles([...FINANCE_ROLES, ROLES.SUPPLIER]), (req, res) => downloadPdf(req, res, "invoice"));
router.get("/payments/:localId/pdf", requireRoles([...PAYMENT_ROLES, ROLES.SUPPLIER]), (req, res) => downloadPdf(req, res, "payment"));
router.post("/invoices/:localId/pdf", requireRoles([...FINANCE_ROLES, ROLES.SUPPLIER]), (req, res) => downloadPdf(req, res, "invoice"));
router.post("/payments/:localId/pdf", requireRoles([...PAYMENT_ROLES, ROLES.SUPPLIER]), (req, res) => downloadPdf(req, res, "payment"));

export default router;
