import nodemailer from "nodemailer";

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

  const info = await transporter.sendMail({
    from,
    to,
    subject: args.subject,
    text: args.text,
    html: args.html,
  });

  const accepted = Array.isArray(info?.accepted) ? info.accepted : [];
  const rejected = Array.isArray(info?.rejected) ? info.rejected : [];

  return {
    sent: accepted.length > 0,
    messageId: info?.messageId,
    accepted,
    rejected,
    response: info?.response,
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

export async function sendSupplierOrderCompletedEmail(args) {
  const supplierEmail = String(args?.supplierEmail ?? "").trim();
  if (!supplierEmail) {
    return { sent: false, reason: "Missing supplier email", accepted: [], rejected: [] };
  }

  const orderNo = String(args?.orderNo ?? "PO");
  const supplierName = String(args?.supplierName ?? "").trim();
  const greetingName = supplierName || supplierEmail;

  const subject = `OptiMind — Order Completed (${orderNo})`;
  const text =
    `Hello ${greetingName},\n\n` +
    `The requester has confirmed receipt for order ${orderNo}.\n` +
    `Thank you for your delivery support. This order is now completed.\n\n` +
    `Regards,\nOptiMind System`;

  const html =
    `<p>Hello ${greetingName},</p>` +
    `<p>The requester has confirmed receipt for order <b>${orderNo}</b>.</p>` +
    `<p>Thank you for your delivery support. This order is now <b>completed</b>.</p>` +
    `<p>Regards,<br/>OptiMind System</p>`;

  return sendSystemNotificationEmail({
    to: [supplierEmail],
    subject,
    text,
    html,
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

