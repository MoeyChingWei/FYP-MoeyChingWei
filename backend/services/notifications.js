import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";
import {
  sendSupplierDiscrepancyEmail,
  sendSupplierOrderCompletedEmail,
  sendSupplierPendingOrderEmail,
  sendSystemNotificationEmail,
} from "./emailNotifications.js";

function uniqueById(users) {
  const seen = new Set();
  const out = [];
  for (const u of users) {
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

function uniqueEmails(users) {
  const seen = new Set();
  const out = [];
  for (const u of users) {
    const email = String(u?.email ?? "").trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}

async function sendRoleEventEmails(users, payload) {
  const to = uniqueEmails(users);
  if (!to.length) return;
  try {
    const result = await sendSystemNotificationEmail({
      to,
      subject: `[ERP Notification] ${payload.title}`,
      text: `${payload.message}\n\nReference: ${payload.refType ?? "-"} ${payload.refId ?? ""}`.trim(),
      html:
        `<h3>${payload.title}</h3>` +
        `<p>${payload.message}</p>` +
        `<p><b>Reference:</b> ${payload.refType ?? "-"} ${payload.refId ?? ""}</p>`,
    });
    if (!result?.sent) {
      console.warn("Notification email not sent:", result?.reason ?? "Unknown reason", {
        title: payload.title,
        to,
        accepted: result?.accepted ?? [],
        rejected: result?.rejected ?? [],
        response: result?.response,
      });
    } else {
      console.log("Notification email sent:", {
        title: payload.title,
        to,
        messageId: result?.messageId,
        accepted: result?.accepted ?? [],
        rejected: result?.rejected ?? [],
        response: result?.response,
      });
    }
  } catch (err) {
    console.error("sendRoleEventEmails error:", err);
  }
}

async function createInAppNotifications(
  users,
  payload,
) {
  const data = uniqueById(users).map((u) => ({
    userId: u.id,
    title: payload.title,
    message: payload.message,
    type: payload.type ?? "INFO",
    refType: payload.refType,
    refId: payload.refId,
  }));
  if (!data.length) return;
  await prisma.notification.createMany({ data });
  await sendRoleEventEmails(users, payload);
}

async function findUsersByRoles(roles) {
  if (!roles.length) return [];
  return prisma.user.findMany({
    where: { role: { in: roles }, isActive: true },
    select: { id: true, email: true, role: true },
  });
}

async function findUserByEmail(email) {
  if (!email) return null;
  const normalized = String(email).trim().toLowerCase();
  if (!normalized) return null;
  return prisma.user.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" }, isActive: true },
    select: { id: true, email: true, role: true },
  });
}

function isInternalRole(role) {
  return (
    role === ROLES.MANAGER ||
    role === ROLES.DEPARTMENT_EXECUTIVE ||
    role === ROLES.EMPLOYEE
  );
}

function parsePayloadMap(rows) {
  const map = new Map();
  for (const row of rows) {
    const payload = row.payload && typeof row.payload === "object" ? row.payload : null;
    if (!payload || typeof payload.localId !== "string") continue;
    map.set(payload.localId, payload);
  }
  return map;
}

function rejectDetailMessage(row) {
  const rejectedBy = String(row?.rejectedBy ?? "").trim() || "Unknown approver";
  const reason = String(row?.rejectionReason ?? "").trim() || "No reject description provided.";
  return `Rejected by: ${rejectedBy}. Description: ${reason}`;
}

export async function processWorkflowNotifications(
  store,
  previousRows,
  nextRows,
) {
  const prevMap = parsePayloadMap(previousRows);
  const nextMap = parsePayloadMap(nextRows);
  let requestContextByPrNumber = null;

  const ensureRequestContextMap = async () => {
    if (requestContextByPrNumber) return requestContextByPrNumber;
    requestContextByPrNumber = new Map();
    const requestRows = await prisma.purchaseRequestRecord.findMany({
      select: { payload: true },
    });
    for (const rr of requestRows) {
      const payload = rr.payload && typeof rr.payload === "object" ? rr.payload : null;
      if (!payload) continue;
      const prNumber = String(payload.prNumber ?? "").trim();
      if (!prNumber) continue;
      requestContextByPrNumber.set(prNumber, {
        localId: String(payload.localId ?? "").trim(),
        createdByEmail: String(payload.createdByEmail ?? "").trim().toLowerCase(),
      });
    }
    return requestContextByPrNumber;
  };

  const resolveRequesterContext = async (
    row,
    fallbackLocalId,
    opts = {},
  ) => {
    const preferSourceRequest = Boolean(opts.preferSourceRequest);
    const sourcePrNumber = String(row?.sourcePrNumber ?? "").trim();
    const sourceRequestLocalId = String(row?.sourceRequestLocalId ?? "").trim();
    const directLocalId = String(row?.localId ?? "").trim();
    const requestLocalId = sourceRequestLocalId || fallbackLocalId || directLocalId || null;

    if (preferSourceRequest && sourcePrNumber) {
      const requestMap = await ensureRequestContextMap();
      const context = requestMap.get(sourcePrNumber);
      const email = String(context?.createdByEmail ?? "").trim();
      if (email) {
        const found = await findUserByEmail(email);
        if (found && isInternalRole(found.role)) {
          return {
            user: found,
            requestLocalId: context?.localId || requestLocalId,
          };
        }
      }
    }

    if (row?.createdByEmail) {
      const direct = await findUserByEmail(row.createdByEmail);
      if (direct && isInternalRole(direct.role)) {
        return { user: direct, requestLocalId };
      }
    }

    if (!sourcePrNumber) return null;

    const requestMap = await ensureRequestContextMap();
    const context = requestMap.get(sourcePrNumber);
    const email = String(context?.createdByEmail ?? "").trim();
    if (!email) return null;
    const found = await findUserByEmail(email);
    if (!found || !isInternalRole(found.role)) return null;
    return {
      user: found,
      requestLocalId: context?.localId || requestLocalId,
    };
  };

  if (store === "purchase-requests") {
    const departmentExecutives = await findUsersByRoles([ROLES.DEPARTMENT_EXECUTIVE]);
    for (const [localId, row] of nextMap) {
      const before = prevMap.get(localId);
      const nowStatus = String(row.status ?? "");
      const beforeStatus = String(before?.status ?? "");
      if (!before) {
        // Draft requests are still in-progress and should not trigger tracking/email notifications.
        if (nowStatus === "SUBMITTED") {
          const requesterContext = await resolveRequesterContext(row, localId);
          if (requesterContext?.user) {
            await createInAppNotifications([requesterContext.user], {
              title: "Purchase Request Generated",
              message: `${row.prNumber ?? "PR"} has been generated. You can check it in Tracking Item.`,
              type: "REQUESTER_CREATED",
              refType: "tracking-item",
              refId: requesterContext.requestLocalId || localId,
            });
          }
        }
      }
      if (nowStatus === "SUBMITTED" && beforeStatus !== "SUBMITTED") {
        await createInAppNotifications(departmentExecutives, {
          title: "New Purchase Request Approval",
          message: `${row.prNumber ?? "PR"} has a new item approval waiting. Please review it in the system.`,
          type: "PURCHASE_REQUEST_APPROVAL",
          refType: "purchase-request",
          refId: localId,
        });
      }
      if (before && beforeStatus !== nowStatus) {
        const requesterContext = await resolveRequesterContext(row, localId);
        if (!requesterContext?.user) continue;
        if (nowStatus === "APPROVED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Purchase Request Approved",
            message:
              `${row.prNumber ?? "PR"} is approved. Please wait for Department Executive to submit the Purchase Order.`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        } else if (nowStatus === "REJECTED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Purchase Request Rejected",
            message: `${row.prNumber ?? "PR"} was rejected. ${rejectDetailMessage(row)}`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        }
      }
    }
    return;
  }

  if (store === "purchase-orders") {
    const managers = await findUsersByRoles([ROLES.MANAGER]);
    for (const [localId, row] of nextMap) {
      const before = prevMap.get(localId);
      const nowStatus = String(row.status ?? "");
      const beforeStatus = String(before?.status ?? "");
      if (nowStatus === "SUBMITTED" && beforeStatus !== "SUBMITTED") {
        await createInAppNotifications(managers, {
          title: "New Purchase Order Approval",
          message: `${row.poNumber ?? "PO"} has a new item approval waiting. Please review it in the system.`,
          type: "PURCHASE_ORDER_APPROVAL",
          refType: "purchase-order",
          refId: localId,
        });
      }
      if (before && beforeStatus !== nowStatus) {
        const requesterContext = await resolveRequesterContext(row, undefined, {
          preferSourceRequest: true,
        });
        if (!requesterContext?.user) continue;
        if (nowStatus === "APPROVED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Purchase Order Approved",
            message:
              `Manager approved ${row.poNumber ?? "PO"}. Please wait for supplier acknowledgement.`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        } else if (nowStatus === "REJECTED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Purchase Order Rejected",
            message: `${row.poNumber ?? "PO"} was rejected. ${rejectDetailMessage(row)}`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        }
      }
    }
    return;
  }

  if (store === "supplier-order-acks") {
    for (const [localId, row] of nextMap) {
      const before = prevMap.get(localId);
      const nowStatus = String(row.status ?? "");
      const beforeStatus = String(before?.status ?? "");
      if (nowStatus === "PENDING_ORDER_ACKNOWLEDGE" && beforeStatus !== "PENDING_ORDER_ACKNOWLEDGE") {
        const supplier = await findUserByEmail(row.supplierEmail);
        if (supplier) {
          await createInAppNotifications([supplier], {
            title: "New Order Acknowledge Request",
            message: `${row.poNumber ?? "PO"} needs your acknowledgement.`,
            type: "SUPPLIER_ORDER_ACK",
            refType: "supplier-order-ack",
            refId: localId,
          });
          const supplierMailResult = await sendSupplierPendingOrderEmail({
            supplierEmail: supplier.email,
            supplierName: row.supplierName,
            orderNo: row.poNumber,
            sourcePrNumber: row.sourcePrNumber,
            createdDate: row.createdDate,
            companyAddress: row.companyAddress,
          });
          if (!supplierMailResult?.sent) {
            console.warn("Supplier pending order email not sent:", {
              supplierEmail: supplier.email,
              reason: supplierMailResult?.reason,
              accepted: supplierMailResult?.accepted ?? [],
              rejected: supplierMailResult?.rejected ?? [],
              response: supplierMailResult?.response,
            });
          } else {
            console.log("Supplier pending order email sent:", {
              supplierEmail: supplier.email,
              messageId: supplierMailResult?.messageId,
              accepted: supplierMailResult?.accepted ?? [],
              rejected: supplierMailResult?.rejected ?? [],
              response: supplierMailResult?.response,
            });
          }
        }
      }
      if (before && beforeStatus !== nowStatus) {
        const requesterContext = await resolveRequesterContext(row, undefined, {
          preferSourceRequest: true,
        });
        if (!requesterContext?.user) continue;
        if (nowStatus === "APPROVED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Order Acknowledged By Supplier",
            message:
              `${row.poNumber ?? "PO"} was acknowledged by ${row.supplierName || row.supplierEmail || "supplier"}. Please wait for delivery.`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        } else if (nowStatus === "REJECTED") {
          await createInAppNotifications([requesterContext.user], {
            title: "Supplier Rejected Acknowledgement",
            message: `${row.poNumber ?? "PO"} acknowledgement was rejected. ${rejectDetailMessage(row)}`,
            type: "REQUESTER_UPDATE",
            refType: "tracking-item",
            refId: requesterContext.requestLocalId || localId,
          });
        }
      }
    }
    return;
  }

  if (store === "deliveries" || store === "grns") {
    for (const [localId, row] of nextMap) {
      const before = prevMap.get(localId);
      const nowStatus = String(row.status ?? "");
      const beforeStatus = String(before?.status ?? "");
      if (!before && store === "deliveries" && nowStatus === "PENDING_DELIVERY") {
        const deliveryRef = row.deliveryNo || row.poNumber || "Delivery";
        const requesterContext = await resolveRequesterContext(row, undefined, {
          preferSourceRequest: true,
        });
        if (!requesterContext?.user) continue;
        await createInAppNotifications([requesterContext.user], {
          title: "Supplier Started New Delivery",
          message: `${deliveryRef} has a new pending delivery submitted by supplier. You can track progress in Tracking Item.`,
          type: "REQUESTER_UPDATE",
          refType: "tracking-item",
          refId: requesterContext.requestLocalId || localId,
        });
        continue;
      }
      if (!before || beforeStatus === nowStatus) continue;
      const requesterContext = await resolveRequesterContext(row, undefined, {
        preferSourceRequest: true,
      });
      if (!requesterContext?.user) continue;
      if (store === "deliveries" && nowStatus === "DELIVERED") {
        const deliveryRef = row.deliveryNo || row.poNumber || "Delivery";
        await createInAppNotifications([requesterContext.user], {
          title: "Order Delivered",
          message:
            `${deliveryRef} has been delivered by supplier. Please collect your parcel and verify the order in system.`,
          type: "REQUESTER_UPDATE",
          refType: "tracking-item",
          refId: requesterContext.requestLocalId || localId,
        });
        continue;
      }

      if (store === "grns" && nowStatus === "COMPLETED") {
        const supplier = await findUserByEmail(row.supplierEmail);
        if (supplier) {
          await createInAppNotifications([supplier], {
            title: "Order Completed",
            message: `${row.poNumber ?? "PO"} has been received by requester. Thank you, this order is completed.`,
            type: "SUPPLIER_UPDATE",
            refType: "grn",
            refId: localId,
          });

          const supplierCompleteMailResult = await sendSupplierOrderCompletedEmail({
            supplierEmail: supplier.email,
            supplierName: row.supplierName,
            orderNo: row.poNumber,
          });
          if (!supplierCompleteMailResult?.sent) {
            console.warn("Supplier completion email not sent:", {
              supplierEmail: supplier.email,
              reason: supplierCompleteMailResult?.reason,
              accepted: supplierCompleteMailResult?.accepted ?? [],
              rejected: supplierCompleteMailResult?.rejected ?? [],
              response: supplierCompleteMailResult?.response,
            });
          } else {
            console.log("Supplier completion email sent:", {
              supplierEmail: supplier.email,
              messageId: supplierCompleteMailResult?.messageId,
              accepted: supplierCompleteMailResult?.accepted ?? [],
              rejected: supplierCompleteMailResult?.rejected ?? [],
              response: supplierCompleteMailResult?.response,
            });
          }
        }

        await createInAppNotifications([requesterContext.user], {
          title: "Item Completed",
          message: `${row.poNumber ?? "PO"} is completed. Your requested item flow has finished.`,
          type: "REQUESTER_UPDATE",
          refType: "tracking-item",
          refId: requesterContext.requestLocalId || localId,
        });
        continue;
      }

      if (store === "grns" && nowStatus === "DISCREPANCY") {
        const supplier = await findUserByEmail(row.supplierEmail);
        if (supplier) {
          await createInAppNotifications([supplier], {
            title: "Discrepancy Reported",
            message: `${row.poNumber ?? "PO"} has a discrepancy. Description: ${row.discrepancyReason || "No description provided."}`,
            type: "SUPPLIER_UPDATE",
            refType: "grn",
            refId: localId,
          });

          const supplierDiscrepancyMailResult = await sendSupplierDiscrepancyEmail({
            supplierEmail: supplier.email,
            supplierName: row.supplierName,
            orderNo: row.poNumber,
            discrepancyReason: row.discrepancyReason,
          });
          if (!supplierDiscrepancyMailResult?.sent) {
            console.warn("Supplier discrepancy email not sent:", {
              supplierEmail: supplier.email,
              reason: supplierDiscrepancyMailResult?.reason,
              accepted: supplierDiscrepancyMailResult?.accepted ?? [],
              rejected: supplierDiscrepancyMailResult?.rejected ?? [],
              response: supplierDiscrepancyMailResult?.response,
            });
          } else {
            console.log("Supplier discrepancy email sent:", {
              supplierEmail: supplier.email,
              messageId: supplierDiscrepancyMailResult?.messageId,
              accepted: supplierDiscrepancyMailResult?.accepted ?? [],
              rejected: supplierDiscrepancyMailResult?.rejected ?? [],
              response: supplierDiscrepancyMailResult?.response,
            });
          }
        }

        await createInAppNotifications([requesterContext.user], {
          title: "GRN Discrepancy Detected",
          message: `${row.poNumber ?? "PO"} has a discrepancy. Please check Tracking Item for follow-up.`,
          type: "REQUESTER_UPDATE",
          refType: "tracking-item",
          refId: requesterContext.requestLocalId || localId,
        });
      }
    }
  }
}

export async function notifyAdminsForFeedback(args) {
  const admins = await findUsersByRoles([ROLES.ADMIN]);
  const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminFeedbackEmails = uniqueEmails(admins).filter(
    (email) => email && email !== superAdminEmail,
  );

  await createInAppNotifications(admins, {
    title: "New Feedback Submitted",
    message: `${args.userName || args.userEmail} submitted ${args.type} feedback.`,
    type: "FEEDBACK",
    refType: "feedback",
    refId: String(args.feedbackId),
  });

  const preview = args.description.length > 240
    ? `${args.description.slice(0, 240)}...`
    : args.description;

  try {
    if (!adminFeedbackEmails.length) {
      console.warn("Feedback email skipped: no admin recipients after super admin exclusion.");
      return;
    }

    await sendSystemNotificationEmail({
      to: adminFeedbackEmails,
      subject: `[ERP Feedback] ${args.type} from ${args.userEmail}`,
      text:
        `Feedback ID: ${args.feedbackId}\n` +
        `Submitted by: ${args.userName || "-"} (${args.userEmail})\n` +
        `Type: ${args.type}\n\n` +
        `Description:\n${args.description}\n`,
      html:
        `<h3>ERP Feedback Submitted</h3>` +
        `<p><b>Feedback ID:</b> ${args.feedbackId}</p>` +
        `<p><b>Submitted by:</b> ${args.userName || "-"} (${args.userEmail})</p>` +
        `<p><b>Type:</b> ${args.type}</p>` +
        `<p><b>Description:</b><br/>${preview.replace(/\n/g, "<br/>")}</p>`,
    });
  } catch (err) {
    console.error("sendSystemNotificationEmail feedback error:", err);
  }
}

