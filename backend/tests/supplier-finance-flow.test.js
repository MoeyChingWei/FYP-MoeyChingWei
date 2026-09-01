import express from "express";
import fs from "fs/promises";
import path from "path";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import prisma from "../config/prisma.js";
import supplierFinanceRoutes from "../routes/supplierFinance.js";
import workflowStorageRoutes from "../routes/workflowStorage.js";

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const ids = { supplier: null, finance: null, payment: null, employee: null, admin: null, invoice: null, paymentRecord: null, draftInvoice: null, foreignInvoice: null, adminInvoice: null, adminPayment: null };
const generatedPdfPaths = new Set();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use((req, _res, next) => {
  const role = req.header("x-test-role");
  const id = Number(req.header("x-test-user-id"));
  const email = req.header("x-test-email");
  if (role && id && email) req.user = { id, email, role, name: `${role} test`, isActive: true };
  next();
});
app.use("/api/supplier-finance", supplierFinanceRoutes);
app.use("/api/workflow", workflowStorageRoutes);

function as(user) {
  return { "x-test-role": user.role, "x-test-user-id": String(user.id), "x-test-email": user.email };
}

let supplier;
let finance;
let paymentTeam;
let employee;

beforeAll(async () => {
  [supplier, finance, paymentTeam, employee] = await Promise.all([
    prisma.user.create({ data: { email: `supplier-flow-${suffix}@example.test`, password: "test", role: "Supplier", name: "Supplier Flow", isActive: true } }),
    prisma.user.create({ data: { email: `finance-flow-${suffix}@example.test`, password: "test", role: "Treasury / Finance Officer", name: "Finance Flow", isActive: true } }),
    prisma.user.create({ data: { email: `payment-flow-${suffix}@example.test`, password: "test", role: "Payment Team", name: "Payment Flow", isActive: true } }),
    prisma.user.create({ data: { email: `employee-flow-${suffix}@example.test`, password: "test", role: "Employee", name: "Employee Flow", isActive: true } }),
  ]);
  const admin = await prisma.user.create({ data: { email: `admin-flow-${suffix}@example.test`, password: "test", role: "Admin", name: "Admin Flow", isActive: true } });
  Object.assign(ids, { supplier: supplier.id, finance: finance.id, payment: paymentTeam.id, employee: employee.id, admin: admin.id });
});

afterAll(async () => {
  const testPaymentIds = [ids.paymentRecord, ids.adminPayment].filter(Boolean);
  const testInvoiceIds = [ids.invoice, ids.draftInvoice, ids.foreignInvoice, ids.adminInvoice].filter(Boolean);
  const testUserIds = [ids.supplier, ids.finance, ids.payment, ids.employee, ids.admin].filter(Boolean);
  // Remove database state first; PDF cleanup can be delayed by a Windows file lock.
  await prisma.supplierPaymentRecordStore.deleteMany({ where: { OR: [{ localId: { in: testPaymentIds } }, { payload: { path: ["supplierEmail"], string_contains: suffix } }] } });
  await prisma.supplierInvoiceRecordStore.deleteMany({ where: { OR: [{ localId: { in: testInvoiceIds } }, { payload: { path: ["supplierEmail"], string_contains: suffix } }] } });
  await prisma.notification.deleteMany({ where: { OR: [{ refId: { in: [...testInvoiceIds, ...testPaymentIds] } }, { refId: { contains: suffix } }, { userId: { in: testUserIds } }] } });
  if (ids.supplier) await prisma.$executeRaw`DELETE FROM "supplier_bank_details" WHERE "supplierId" = ${ids.supplier}`;
  await prisma.user.deleteMany({ where: { OR: [{ id: { in: testUserIds } }, { email: { contains: suffix } }] } });
  await Promise.all(Array.from(generatedPdfPaths, (relativePath) => fs.rm(path.join(process.cwd(), "uploads", relativePath), { force: true }).catch(() => {})));
  await prisma.$disconnect();
});

describe("supplier invoice to payment API", () => {
  it("enforces the received GRN, submit, reject/resubmit, approve and paid workflow", async () => {
    const grn = {
      localId: `test-grn-${suffix}`,
      status: "RECEIVED",
      completedDate: "2026-08-25",
      deliveryNo: `GRN-${suffix}`,
      poLocalId: `po-${suffix}`,
      poNumber: `PO-${suffix}`,
      sourcePrNumber: `PR-${suffix}`,
      supplierId: supplier.id,
      supplierName: "Supplier Flow",
      supplierEmail: supplier.email,
      currency: "MYR",
      paymentTerms: "30 days",
      items: [{ tempId: "line-1", itemName: "Test item", itemDescription: "Workflow test", quantity: 2, unitPrice: 100, taxRate: 6 }],
    };
    const draft = await request(app).post("/api/supplier-finance/invoices/from-grn").set(as(employee)).send({ userId: employee.id, email: employee.email, grn }).expect(201);
    ids.invoice = draft.body.invoice.localId;
    expect(draft.body.invoice.status).toBe("DRAFT");
    expect(draft.body.invoice.grandTotal).toBe(212);
    const repeatedDraft = await request(app).post("/api/supplier-finance/invoices/from-grn").set(as(employee)).send({ userId: employee.id, email: employee.email, grn }).expect(200);
    expect(repeatedDraft.body).toMatchObject({ created: false, invoice: { localId: ids.invoice, status: "DRAFT" } });

    const supplierInvoices = await request(app).get("/api/supplier-finance/invoices").set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);
    expect(supplierInvoices.body.invoices).toHaveLength(1);
    await request(app).get("/api/supplier-finance/payments").set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);

    await request(app).put("/api/supplier-finance/bank-details").set(as(supplier)).send({ userId: supplier.id, email: supplier.email, bankName: "Test Bank", accountName: "Supplier Flow", accountNumber: "1234567890" }).expect(200);
    const submitted = await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/submit`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(200);
    generatedPdfPaths.add(submitted.body.invoice.invoicePdf.path);
    expect(submitted.body.invoice.status).toBe("SUBMITTED");
    expect(submitted.body.invoice.bankDetails.accountNumber).toBe("1234567890");
    expect(submitted.body.invoice.grandTotal).toBe(212);
    expect(await prisma.notification.count({ where: { refId: ids.invoice, type: "SUPPLIER_INVOICE_APPROVAL" } })).toBeGreaterThan(0);
    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/submit`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(409);
    const invoicePdf = await request(app).get(`/api/supplier-finance/invoices/${ids.invoice}/pdf`).set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);
    expect(invoicePdf.headers["content-type"]).toContain("application/pdf");

    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/reject`).set(as(finance)).send({ userId: finance.id, email: finance.email }).expect(400);
    const rejected = await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/reject`).set(as(finance)).send({ userId: finance.id, email: finance.email, reason: "Missing delivery note" }).expect(200);
    expect(rejected.body.invoice.status).toBe("REJECTED");
    expect(rejected.body.invoice.rejectionReason).toBe("Missing delivery note");
    expect(rejected.body.invoice.rejectedBy).toBe("Treasury / Finance Officer test");
    expect(await prisma.notification.count({ where: { userId: supplier.id, refId: ids.invoice, type: "SUPPLIER_UPDATE", title: "Supplier Invoice Rejected" } })).toBeGreaterThan(0);

    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/submit`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(200);
    const approved = await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/approve`).set(as(finance)).send({ userId: finance.id, email: finance.email }).expect(200);
    generatedPdfPaths.add(approved.body.invoice.invoicePdf.path);
    ids.paymentRecord = approved.body.payment.localId;
    expect(approved.body.invoice.status).toBe("APPROVED");
    expect(approved.body.payment.status).toBe("PENDING_PAYMENT");
    expect(await prisma.notification.count({ where: { refId: ids.paymentRecord, type: "SUPPLIER_PAYMENT_PENDING" } })).toBeGreaterThan(0);
    expect(await prisma.notification.count({ where: { userId: supplier.id, refId: ids.paymentRecord, type: "SUPPLIER_PAYMENT_PENDING" } })).toBeGreaterThan(0);
    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/approve`).set(as(finance)).send({ userId: finance.id, email: finance.email }).expect(409);
    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/reject`).set(as(finance)).send({ userId: finance.id, email: finance.email, reason: "Late" }).expect(409);
    expect(await prisma.supplierPaymentRecordStore.count({ where: { localId: ids.paymentRecord } })).toBe(1);

    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-08-25" }).expect(400);
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-02-30", transactionReference: "invalid-date", attachment: { attachmentName: "proof.pdf", attachmentType: "application/pdf", attachmentDataUrl: "data:application/pdf;base64,JVBERi0=" } }).expect(400);
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-08-25", transactionReference: "invalid-type", attachment: { attachmentName: "proof.txt", attachmentType: "text/plain", attachmentDataUrl: "data:text/plain;base64,dGVzdA==" } }).expect(400);
    const oversizedProof = Buffer.alloc(5 * 1024 * 1024 + 1).toString("base64");
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-08-25", transactionReference: "oversized", attachment: { attachmentName: "proof.pdf", attachmentType: "application/pdf", attachmentDataUrl: `data:application/pdf;base64,${oversizedProof}` } }).expect(400);
    const paid = await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-08-25", transactionReference: `TX-${suffix}`, attachment: { attachmentName: "proof.pdf", attachmentType: "application/pdf", attachmentDataUrl: "data:application/pdf;base64,JVBERi0=" } }).expect(200);
    generatedPdfPaths.add(paid.body.payment.paymentAdvicePdf.path);
    expect(paid.body.payment.status).toBe("PAID");
    expect(paid.body.payment.paymentAdvicePdf.filename).toContain("payment-advice-");
    expect(await prisma.notification.count({ where: { refId: ids.paymentRecord, type: "SUPPLIER_PAYMENT_COMPLETED" } })).toBeGreaterThan(0);
    const advicePdf = await request(app).get(`/api/supplier-finance/payments/${ids.paymentRecord}/pdf`).set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);
    expect(advicePdf.headers["content-type"]).toContain("application/pdf");
    const advicePrint = await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/print`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email, companyLogo: "data:image/png;base64,AA==" }).expect(200);
    expect(advicePrint.text).toContain('alt="Sender logo"');
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email, paymentMethod: "Bank Transfer", paidDate: "2026-08-25", transactionReference: `TX-${suffix}`, attachment: { attachmentName: "proof.pdf", attachmentType: "application/pdf", attachmentDataUrl: "data:application/pdf;base64,JVBERi0=" } }).expect(409);
  }, 60000);

  it("prevents suppliers from approving or processing payments", async () => {
    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/approve`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(403);
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(403);
    await request(app).post(`/api/supplier-finance/invoices/${ids.invoice}/approve`).set(as(paymentTeam)).send({ userId: paymentTeam.id, email: paymentTeam.email }).expect(403);
    await request(app).post(`/api/supplier-finance/payments/${ids.paymentRecord}/process`).set(as(finance)).send({ userId: finance.id, email: finance.email }).expect(403);
    await request(app).get("/api/supplier-finance/invoices").set(as(employee)).query({ userId: employee.id, email: employee.email }).expect(403);
    await request(app).get("/api/workflow/supplier-invoices").expect(410);
    await request(app).put("/api/workflow/supplier-payments").send({ rows: [] }).expect(410);
  });

  it("enforces non-submitted state transitions, supplier record isolation, no-bank PDFs, and Admin actions", async () => {
    const draftGrn = { localId: `draft-grn-${suffix}`, status: "RECEIVED", deliveryNo: "DRAFT-GRN", poNumber: "DRAFT-PO", supplierId: supplier.id, supplierEmail: supplier.email, currency: "MYR", items: [{ itemName: "Draft", quantity: 1, unitPrice: 10, taxRate: 0 }] };
    const draft = await request(app).post("/api/supplier-finance/invoices/from-grn").set(as(employee)).send({ userId: employee.id, email: employee.email, grn: draftGrn }).expect(201);
    ids.draftInvoice = draft.body.invoice.localId;
    generatedPdfPaths.add(`supplier-finance/supplier-invoice-approval-summary-${draft.body.invoice.invoiceNumber}.pdf`);
    await request(app).get(`/api/supplier-finance/invoices/${ids.draftInvoice}/pdf`).set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);
    await request(app).post(`/api/supplier-finance/invoices/${ids.draftInvoice}/approve`).set(as(finance)).send({ userId: finance.id, email: finance.email }).expect(409);
    await request(app).post(`/api/supplier-finance/invoices/${ids.draftInvoice}/reject`).set(as(finance)).send({ userId: finance.id, email: finance.email, reason: "Not submitted" }).expect(409);
    const foreign = await request(app).post("/api/supplier-finance/invoices/from-grn").set(as(employee)).send({ userId: employee.id, email: employee.email, grn: { ...draftGrn, localId: `foreign-grn-${suffix}`, supplierId: supplier.id + 999999, supplierEmail: `foreign-${suffix}@example.test` } }).expect(201);
    ids.foreignInvoice = foreign.body.invoice.localId;
    const supplierVisible = await request(app).get("/api/supplier-finance/invoices").set(as(supplier)).query({ userId: supplier.id, email: supplier.email }).expect(200);
    expect(supplierVisible.body.invoices.some((invoice) => invoice.localId === ids.foreignInvoice)).toBe(false);

    const adminGrn = { ...draftGrn, localId: `admin-grn-${suffix}`, deliveryNo: "ADMIN-GRN", poNumber: "ADMIN-PO" };
    const adminDraft = await request(app).post("/api/supplier-finance/invoices/from-grn").set(as(employee)).send({ userId: employee.id, email: employee.email, grn: adminGrn }).expect(201);
    ids.adminInvoice = adminDraft.body.invoice.localId;
    const adminSubmitted = await request(app).post(`/api/supplier-finance/invoices/${ids.adminInvoice}/submit`).set(as(supplier)).send({ userId: supplier.id, email: supplier.email }).expect(200);
    generatedPdfPaths.add(adminSubmitted.body.invoice.invoicePdf.path);
    const adminApproved = await request(app).post(`/api/supplier-finance/invoices/${ids.adminInvoice}/approve`).set(as({ id: ids.admin, email: `admin-flow-${suffix}@example.test`, role: "Admin" })).send({ userId: ids.admin, email: `admin-flow-${suffix}@example.test` }).expect(200);
    generatedPdfPaths.add(adminApproved.body.invoice.invoicePdf.path);
    ids.adminPayment = adminApproved.body.payment.localId;
    const adminPaid = await request(app).post(`/api/supplier-finance/payments/${ids.adminPayment}/process`).set(as({ id: ids.admin, email: `admin-flow-${suffix}@example.test`, role: "Admin" })).send({ userId: ids.admin, email: `admin-flow-${suffix}@example.test`, paymentMethod: "GIRO", paidDate: "2026-08-25", transactionReference: `ADMIN-${suffix}`, attachment: { attachmentName: "admin-proof.png", attachmentType: "image/png", attachmentDataUrl: "data:image/png;base64,iVBORw0KGgo=" } }).expect(200);
    generatedPdfPaths.add(adminPaid.body.payment.paymentAdvicePdf.path);
    expect(adminPaid.body.payment.status).toBe("PAID");
  }, 90000);
});
