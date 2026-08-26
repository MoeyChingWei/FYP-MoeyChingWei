import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { applyGmailLabelToMessage } from "./gmailOAuth.js";
import { PDFGenerator } from "./pdf-generator.js";
import {
  hydrateWorkflowCompanyLogo,
  hydrateWorkflowItemImages,
  workflowHtml,
} from "../routes/export.js";

const DEFAULT_FEEDBACK_RECIPIENTS = [
  "fypadminsystem@gmail.com",
  "fypexecutive@gmail.com",
  "finalypmanager@gmail.com",
  "chingweimoey@gmail.com",
  "chingweimoey@1utar.my",
  "weiweiweiiiiiii77@gmail.com",
];

function getRecipients() {
  const fromEnv = String(process.env.SYSTEM_NOTIFICATION_RECIPIENTS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  return fromEnv.length ? fromEnv : DEFAULT_FEEDBACK_RECIPIENTS;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "chingweimoey@gmail.com",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

const escapeHtml = (value) => String(value ?? "-")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

function textValue(value, fallback = "-") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function formatMoney(value, currency = "MYR") {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} -`;
  return `${currency} ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function normalizeItems(record = {}) {
  return Array.isArray(record.items)
    ? record.items
    : (Array.isArray(record.lineItems) ? record.lineItems : []);
}

/** Convert remote item images to data URLs so email clients can render them. */
async function hydrateEmailItemImages(record = {}) {
  const items = normalizeItems(record);
  if (!items.length || typeof fetch !== "function") return record;

  const hydratedItems = await Promise.all(items.map(async (item) => {
    const source = item.itemImageUrl || item.imageUrl || item.image || item.imageDataUrl;
    if (!/^https?:\/\//i.test(String(source || ""))) return item;
    try {
      const signal = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(8000)
        : undefined;
      const response = await fetch(source, signal ? { signal } : undefined);
      const contentType = String(response.headers.get("content-type") || "").split(";", 1)[0];
      if (!response.ok || !/^image\//i.test(contentType)) return item;
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length || buffer.length > 8_000_000) return item;
      return { ...item, itemImageUrl: `data:${contentType};base64,${buffer.toString("base64")}` };
    } catch {
      return item;
    }
  }));

  const field = Array.isArray(record.items) ? "items" : (Array.isArray(record.lineItems) ? "lineItems" : null);
  return field ? { ...record, [field]: hydratedItems } : record;
}

async function prepareEmailRecord(record = {}) {
  let hydrated = record;
  try {
    hydrated = await hydrateWorkflowItemImages(record);
  } catch (error) {
    console.error("Workflow email item image hydration failed:", error?.message || error);
  }
  return hydrateEmailItemImages(hydrated);
}

function parseInlineImage(source, index, attachments) {
  const value = String(source || "");
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (!match) return value;
  const cid = `optimind-item-${index}-${randomUUID()}@optimind`;
  attachments.push({
    filename: `item-${index + 1}.image`,
    content: Buffer.from(match[2], "base64"),
    contentType: match[1],
    cid,
  });
  return `cid:${cid}`;
}

function renderItems(record, currency = "MYR") {
  const items = normalizeItems(record);
  const inlineAttachments = [];
  const textLines = [];
  const rows = items.map((item, index) => {
    const imageSource = item.itemImageUrl || item.imageUrl || item.image || item.imageDataUrl;
    const imageSrc = parseInlineImage(imageSource, index, inlineAttachments);
    const quantity = textValue(item.quantity);
    const unit = textValue(item.unitOfMeasurement || item.unit);
    const unitPrice = formatMoney(item.unitPrice, currency);
    const tax = item.taxAmount != null ? formatMoney(item.taxAmount, currency) : "-";
    const amount = formatMoney(
      item.amountAfterTax ?? item.amount ?? item.lineTotal ?? Number(item.quantity || 0) * Number(item.unitPrice || 0),
      currency,
    );
    textLines.push(
      `${index + 1}. ${textValue(item.itemName)} - ${textValue(item.itemDescription)}; ` +
      `Quantity: ${quantity} ${unit}; Unit price: ${unitPrice}; Tax: ${tax}; Amount: ${amount}`,
    );
    return `<tr><td>${index + 1}</td><td>${imageSrc ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.itemName)}" style="width:64px;height:64px;object-fit:contain" />` : "-"}</td><td><b>${escapeHtml(item.itemName)}</b><br/><span style="color:#667085">${escapeHtml(item.itemDescription)}</span></td><td>${escapeHtml(quantity)} ${escapeHtml(unit)}</td><td>${escapeHtml(unitPrice)}</td><td>${escapeHtml(tax)}</td><td>${escapeHtml(amount)}</td></tr>`;
  }).join("");

  return {
    html: `<h3 style="margin:22px 0 8px">Order Items</h3><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="background:#f2f4f7"><th style="padding:8px;border:1px solid #d0d5dd">No.</th><th style="padding:8px;border:1px solid #d0d5dd">Image</th><th style="padding:8px;border:1px solid #d0d5dd;text-align:left">Item</th><th style="padding:8px;border:1px solid #d0d5dd">Qty</th><th style="padding:8px;border:1px solid #d0d5dd">Unit price</th><th style="padding:8px;border:1px solid #d0d5dd">Tax</th><th style="padding:8px;border:1px solid #d0d5dd">Amount</th></tr></thead><tbody>${rows || '<tr><td colspan="7" style="padding:8px;border:1px solid #d0d5dd">No items</td></tr>'}</tbody></table>`,
    text: textLines.length ? `Order Items\n${textLines.join("\n")}` : "Order Items\nNo items",
    attachments: inlineAttachments,
  };
}

function renderDetails(rows) {
  const validRows = rows.filter(([, value]) => String(value ?? "").trim());
  return {
    html: `<table style="border-collapse:collapse;margin:12px 0;font-size:13px">${validRows.map(([label, value]) => `<tr><td style="padding:4px 18px 4px 0;color:#475467"><b>${escapeHtml(label)}</b></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`).join("")}</table>`,
    text: validRows.map(([label, value]) => `${label}: ${value}`).join("\n"),
  };
}

export function renderEmailDocument({ title, intro, details = [], itemsRecord, total, action, footer = "Regards,\nOptiMind System" }) {
  const detailMarkup = renderDetails(details);
  const itemMarkup = itemsRecord ? renderItems(itemsRecord, itemsRecord.currency || "MYR") : { html: "", text: "", attachments: [] };
  const totalMarkup = total != null
    ? `<p style="font-size:15px"><b>Total Amount: ${escapeHtml(formatMoney(total, itemsRecord?.currency || "MYR"))}</b></p>`
    : "";
  return {
    html: `<div style="font-family:Arial,sans-serif;color:#17202a;max-width:760px"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p>${detailMarkup.html}${itemMarkup.html}${totalMarkup}<p>${escapeHtml(action).replace(/\n/g, "<br/>")}</p><p>${escapeHtml(footer).replace(/\n/g, "<br/>")}</p></div>`,
    text: `${title}\n\n${intro}\n\n${detailMarkup.text}${itemMarkup.text ? `\n\n${itemMarkup.text}` : ""}${total != null ? `\n\nTotal Amount: ${formatMoney(total, itemsRecord?.currency || "MYR")}` : ""}\n\n${action}\n\n${footer}`,
    attachments: itemMarkup.attachments,
  };
}

async function createWorkflowPdfAttachment(document) {
  if (!document?.workflowType || !document?.record) return null;
  const generator = new PDFGenerator();
  const tempDir = path.join(process.cwd(), "temp", "email-exports");
  const outputPath = path.join(tempDir, `${randomUUID()}.pdf`);
  try {
    const recordWithLogo = await hydrateWorkflowCompanyLogo(document.record);
    const record = await hydrateWorkflowItemImages(recordWithLogo);
    await generator.generatePDF(workflowHtml(document.workflowType, record, document.pageTitle), outputPath);
    return {
      filename: document.filename,
      content: await fs.readFile(outputPath),
      contentType: "application/pdf",
    };
  } finally {
    await fs.rm(outputPath, { force: true }).catch(() => {});
    await generator.close().catch(() => {});
  }
}

export async function sendSystemNotificationEmail(args) {
  const transporter = createTransporter();
  if (!transporter) {
    return { sent: false, reason: "SMTP not configured", accepted: [], rejected: [] };
  }

  const to = args.to?.length ? args.to : getRecipients();
  if (!to.length) {
    return { sent: false, reason: "No recipients configured", accepted: [], rejected: [] };
  }

  const from = process.env.SMTP_FROM || "OptiMind <chingweimoey@gmail.com>";
  const attachments = [...(Array.isArray(args.attachments) ? args.attachments : [])];
  let attachmentError = null;
  if (args.document) {
    try {
      const pdfAttachment = await createWorkflowPdfAttachment(args.document);
      if (pdfAttachment) attachments.push(pdfAttachment);
    } catch (error) {
      attachmentError = error?.message || "Workflow PDF generation failed";
      console.error("Workflow email PDF generation error:", error);
    }
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    attachments,
  });

  const accepted = Array.isArray(info?.accepted) ? info.accepted : [];
  const rejected = Array.isArray(info?.rejected) ? info.rejected : [];

  // Label each mailbox independently. A recipient must authorize their own
  // Gmail account before OptiMind can create/apply a label in that Inbox.
  // Labeling failures must never make a successfully sent email fail.
  const senderEmail = String(process.env.SMTP_USER || "").trim().toLowerCase();
  const mailboxes = [senderEmail, ...accepted.map((value) => String(value || "").trim().toLowerCase())]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
  const gmailLabels = [];
  for (const mailboxEmail of mailboxes) {
    try {
      const result = await applyGmailLabelToMessage({
        messageId: info?.messageId,
        subject: args.subject,
        recipientEmail: mailboxEmail,
        toEmail: mailboxEmail === senderEmail ? undefined : mailboxEmail,
      });
      gmailLabels.push({ email: mailboxEmail, ...result });
    } catch (error) {
      gmailLabels.push({
        email: mailboxEmail,
        labeled: false,
        reason: error?.message || "Gmail label unavailable",
      });
    }
  }
  const gmailLabel = gmailLabels.find((entry) => entry.email === senderEmail) || gmailLabels[0] || null;

  return {
    sent: accepted.length > 0,
    messageId: info?.messageId,
    accepted,
    rejected,
    response: info?.response,
    gmailLabel,
    gmailLabels,
    attachmentError,
  };
}

export async function sendSupplierPendingOrderEmail(args) {
  const supplierEmail = String(args?.supplierEmail ?? "").trim();
  if (!supplierEmail) {
    return { sent: false, reason: "Missing supplier email", accepted: [], rejected: [] };
  }

  const orderNo = String(args?.orderNo ?? "PO");
  const sourcePrNumber = String(args?.sourcePrNumber ?? "-");
  const createdDate = String(args?.createdDate ?? "-");
  const companyAddress = String(args?.companyAddress ?? "-");
  const supplierName = String(args?.supplierName ?? "").trim();
  const greetingName = supplierName || supplierEmail;

  const subject = `OptiMind — New Pending Order (${orderNo})`;
  const text =
    `Hello ${greetingName},\n\n` +
    `You have received a new pending order acknowledgement request.\n\n` +
    `Order No: ${orderNo}\n` +
    `Source PR No: ${sourcePrNumber}\n` +
    `Created Date: ${createdDate}\n` +
    `Company Address: ${companyAddress}\n\n` +
    `Please sign in to OptiMind and review this order.\n`;

  const html =
    `<p>Hello ${greetingName},</p>` +
    `<p>You have received a <b>new pending order acknowledgement request</b>.</p>` +
    `<p><b>Order No:</b> ${orderNo}<br/>` +
    `<b>Source PR No:</b> ${sourcePrNumber}<br/>` +
    `<b>Created Date:</b> ${createdDate}<br/>` +
    `<b>Company Address:</b> ${companyAddress}</p>` +
    `<p>Please sign in to <b>OptiMind</b> and review this order.</p>`;

  return sendSystemNotificationEmail({
    to: [supplierEmail],
    subject,
    text,
    html,
  });
}

export async function sendDetailedSupplierPendingOrderEmail(args) {
  const supplierEmail = String(args?.supplierEmail ?? "").trim();
  if (!supplierEmail) {
    return { sent: false, reason: "Missing supplier email", accepted: [], rejected: [] };
  }

  const record = { ...(args?.record || {}), ...args };
  const orderNo = String(record.orderNo ?? record.poNumber ?? "PO");
  const supplierName = String(record.supplierName ?? record.supplierCompanyName ?? "").trim();
  const greetingName = supplierName || supplierEmail;
  const documentRecord = {
    ...record,
    poNumber: orderNo,
    supplierName,
    supplierCompanyName: record.supplierCompanyName || supplierName,
    supplierEmail,
    companyName: record.companyName || "OptiMind",
    items: normalizeItems(record),
  };
  // Legacy order records may only persist the linked inventory item id. Resolve
  // the image before rendering the email body so it matches the PDF attachment.
  const hydratedDocumentRecord = await prepareEmailRecord(documentRecord);
  const subject = `OptiMind - New Purchase Order Acknowledgement Request (${orderNo})`;
  const rendered = renderEmailDocument({
    title: subject,
    intro: `Hello ${greetingName}, you have received a new Purchase Order acknowledgement request.`,
    details: [
      ["PO Number", orderNo],
      ["Source PR Number", record.sourcePrNumber],
      ["Requester", record.sourceRequester || record.requesterName],
      ["Department", record.department],
      ["Created Date", record.createdDate],
      ["Currency", record.currency],
      ["Payment Terms", record.paymentTerms],
      ["Company", record.companyName || "OptiMind"],
      ["Company Address", record.companyAddress],
    ],
    itemsRecord: hydratedDocumentRecord,
    total: record.totalAmount ?? record.total,
    action: "Please sign in to OptiMind to review and acknowledge this order.",
  });

  return sendSystemNotificationEmail({
    to: [supplierEmail],
    subject,
    text: rendered.text,
    html: rendered.html,
    attachments: rendered.attachments,
    document: {
      workflowType: "acknowledgement",
      record: hydratedDocumentRecord,
      pageTitle: "Order Acknowledgement",
      filename: `Purchase-Order-${orderNo}.pdf`,
    },
  });
}

export async function sendDetailedSupplierDiscrepancyEmail(args) {
  const supplierEmail = String(args?.supplierEmail ?? "").trim();
  if (!supplierEmail) {
    return { sent: false, reason: "Missing supplier email", accepted: [], rejected: [] };
  }

  const record = { ...(args?.record || {}), ...args };
  const orderNo = String(record.orderNo ?? record.poNumber ?? "PO");
  const supplierName = String(record.supplierName ?? record.supplierCompanyName ?? "").trim();
  const greetingName = supplierName || supplierEmail;
  const discrepancyReason = String(record.discrepancyReason ?? "").trim() || "No description provided.";
  const documentRecord = {
    ...record,
    poNumber: orderNo,
    originalOrderNo: record.originalOrderNo || orderNo,
    supplierName,
    supplierCompanyName: record.supplierCompanyName || supplierName,
    supplierEmail,
    companyName: record.companyName || "OptiMind",
    discrepancyReason,
    items: normalizeItems(record),
  };
  const hydratedDocumentRecord = await prepareEmailRecord(documentRecord);
  const subject = `OptiMind - Discrepancy Reported (${orderNo})`;
  const rendered = renderEmailDocument({
    title: subject,
    intro: `Hello ${greetingName}, a discrepancy has been reported for this order.`,
    details: [
      ["PO Number", orderNo],
      ["Source PR Number", record.sourcePrNumber],
      ["Reported Date", record.reportedDate || record.updatedDate],
      ["Supplier", supplierName],
      ["Description", discrepancyReason],
    ],
    itemsRecord: hydratedDocumentRecord,
    action: "Please sign in to OptiMind to review this case and take the necessary follow-up action.",
  });

  return sendSystemNotificationEmail({
    to: [supplierEmail],
    subject,
    text: rendered.text,
    html: rendered.html,
    attachments: rendered.attachments,
    document: {
      workflowType: "grn",
      record: hydratedDocumentRecord,
      pageTitle: "Discrepancy Report",
      filename: `Discrepancy-Report-${orderNo}.pdf`,
    },
  });
}

export async function sendSupplierDiscrepancyEmail(args) {
  const supplierEmail = String(args?.supplierEmail ?? "").trim();
  if (!supplierEmail) {
    return { sent: false, reason: "Missing supplier email", accepted: [], rejected: [] };
  }

  const orderNo = String(args?.orderNo ?? "PO");
  const supplierName = String(args?.supplierName ?? "").trim();
  const greetingName = supplierName || supplierEmail;
  const discrepancyReason = String(args?.discrepancyReason ?? "").trim() || "No description provided.";

  const subject = `OptiMind — Discrepancy Reported (${orderNo})`;
  const text =
    `Hello ${greetingName},\n\n` +
    `A discrepancy has been reported for order ${orderNo}.\n\n` +
    `Description: ${discrepancyReason}\n\n` +
    `Please review this case in OptiMind and take the necessary follow-up action.\n\n` +
    `Regards,\nOptiMind System`;

  const html =
    `<p>Hello ${greetingName},</p>` +
    `<p>A discrepancy has been reported for order <b>${orderNo}</b>.</p>` +
    `<p><b>Description:</b> ${discrepancyReason}</p>` +
    `<p>Please review this case in <b>OptiMind</b> and take the necessary follow-up action.</p>` +
    `<p>Regards,<br/>OptiMind System</p>`;

  return sendSystemNotificationEmail({
    to: [supplierEmail],
    subject,
    text,
    html,
  });
}

function calculateItemsTotal(record) {
  const total = normalizeItems(record).reduce((sum, item) => {
    const amount = item.amountAfterTax ?? item.amount ?? Number(item.quantity || 0) * Number(item.unitPrice || 0);
    return sum + (Number(amount) || 0);
  }, 0);
  return total || null;
}

function purchaseStatusContent(kind, event, record) {
  const isRequest = kind === "purchase-request";
  const number = isRequest ? record.prNumber || "PR" : record.poNumber || "PO";
  const label = isRequest ? "Purchase Request" : "Purchase Order";
  const reason = String(record.rejectionReason ?? record.rejectedReason ?? "").trim() || "No reason provided.";
  if (event === "SUBMITTED") {
    return {
      subject: `OptiMind - New ${label} Approval (${number})`,
      intro: `Hello, a new ${label} is waiting for your approval.`,
      action: `Please sign in to OptiMind to review and approve or reject this ${label}.`,
      includeItems: true,
      attachPdf: true,
    };
  }
  if (event === "APPROVED") {
    return {
      subject: `OptiMind - ${label} Approved (${number})`,
      intro: `${number} has been approved.`,
      action: isRequest
        ? "Please wait for the Purchase Order to be created by the Department Executive."
        : "The Purchase Order can now proceed to supplier acknowledgement.",
      includeItems: false,
      attachPdf: true,
    };
  }
  return {
    subject: `OptiMind - ${label} Rejected (${number})`,
    intro: `${number} has been rejected.`,
    action: `Rejected by: ${record.rejectedBy || record.approvedBy || "Approver"}\nReason: ${reason}\n\nPlease sign in to OptiMind to review the rejection details.`,
    includeItems: false,
    attachPdf: false,
  };
}

async function sendPurchaseWorkflowEmail({ kind, event, record, recipients }) {
  const normalizedRecord = {
    ...record,
    items: normalizeItems(record),
    companyName: record.companyName || "OptiMind",
    requestBy: record.requestBy || record.requesterName || record.createdBy || record.sourceRequester,
    requestDate: record.requestDate || record.createdDate,
    status: event,
  };
  const hydratedRecord = await prepareEmailRecord(normalizedRecord);
  const config = purchaseStatusContent(kind, event, hydratedRecord);
  const isRequest = kind === "purchase-request";
  const number = isRequest ? hydratedRecord.prNumber || "PR" : hydratedRecord.poNumber || "PO";
  const details = isRequest
    ? [
        ["PR Number", number],
        ["Requester", hydratedRecord.requesterName || hydratedRecord.requestBy || hydratedRecord.createdBy || hydratedRecord.sourceRequester],
        ["Department", hydratedRecord.department],
        ["Submitted Date", hydratedRecord.requestDate || hydratedRecord.createdDate],
        ["Currency", hydratedRecord.currency],
      ]
    : [
        ["PO Number", number],
        ["Source PR Number", hydratedRecord.sourcePrNumber],
        ["Requester", hydratedRecord.sourceRequester || hydratedRecord.requesterName],
        ["Department", hydratedRecord.department],
        ["Created Date", hydratedRecord.createdDate],
        ["Currency", hydratedRecord.currency],
        ["Payment Terms", hydratedRecord.paymentTerms],
        ["Supplier", hydratedRecord.supplierCompanyName || hydratedRecord.supplierName],
        ["Supplier Email", hydratedRecord.supplierEmail],
        ["Supplier Address", hydratedRecord.supplierAddress],
      ];
  const rendered = renderEmailDocument({
    title: config.subject,
    intro: config.intro,
    details,
    itemsRecord: config.includeItems ? hydratedRecord : null,
    total: hydratedRecord.totalAmount ?? hydratedRecord.total ?? calculateItemsTotal(hydratedRecord),
    action: config.action,
  });

  return sendSystemNotificationEmail({
    to: recipients,
    subject: config.subject,
    text: rendered.text,
    html: rendered.html,
    attachments: rendered.attachments,
    document: config.attachPdf
      ? {
          workflowType: kind,
          record: hydratedRecord,
          pageTitle: isRequest ? "Purchase Request" : "Purchase Order",
          filename: `${isRequest ? "Purchase-Request" : "Purchase-Order"}-${number}.pdf`,
        }
      : undefined,
  });
}

export function sendPurchaseRequestWorkflowEmail(args) {
  return sendPurchaseWorkflowEmail({ ...args, kind: "purchase-request" });
}

export function sendPurchaseOrderWorkflowEmail(args) {
  return sendPurchaseWorkflowEmail({ ...args, kind: "purchase-order" });
}
