/**
 * Human-friendly status labels and visual tones used by exported documents.
 * Keep the raw enum out of user-facing PDF content while retaining a stable
 * fallback for statuses introduced by future workflow changes.
 */

const STATUS_LABELS = {
  PENDING: "Pending",
  PENDING_APPROVAL: "Pending approval",
  PENDING_ACKNOWLEDGE: "Pending acknowledgement",
  PENDING_ORDER_ACKNOWLEDGE: "Pending acknowledgement",
  PENDING_DELIVERY: "Pending delivery",
  PENDING_GRN: "Pending goods receipt",
  PENDING_PAYMENT: "Pending payment",
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  IN_REVIEW: "In review",
  PROCESSING: "Processing",
  APPROVED: "Approved",
  CONFIRMED: "Confirmed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  CANCELED: "Cancelled",
  DELIVERED: "Delivered",
  RECEIVED: "Received",
  PARTIALLY_RECEIVED: "Partially received",
  COMPLETED: "Completed",
  PAID: "Paid",
  SCHEDULED: "Scheduled",
  OVERDUE: "Overdue",
  DISCREPANCY: "Discrepancy",
};

const STATUS_TONES = {
  pending: new Set([
    "PENDING", "PENDING_APPROVAL", "PENDING_ACKNOWLEDGE",
    "PENDING_ORDER_ACKNOWLEDGE", "PENDING_DELIVERY", "PENDING_GRN",
    "PENDING_PAYMENT", "IN_REVIEW", "SCHEDULED",
  ]),
  success: new Set([
    "APPROVED", "CONFIRMED", "ACCEPTED", "DELIVERED", "RECEIVED",
    "COMPLETED", "PAID",
  ]),
  danger: new Set(["REJECTED", "CANCELLED", "CANCELED", "OVERDUE", "DISCREPANCY", "FAILED"]),
  info: new Set(["SUBMITTED", "PROCESSING"]),
};

function normalizeStatus(status) {
  return String(status ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function titleCaseStatus(status) {
  return normalizeStatus(status)
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Not specified";
}

export function getStatusDisplay(status) {
  const code = normalizeStatus(status);
  let tone = "neutral";
  for (const [candidateTone, statuses] of Object.entries(STATUS_TONES)) {
    if (statuses.has(code)) {
      tone = candidateTone;
      break;
    }
  }

  return {
    code: code || "UNKNOWN",
    label: STATUS_LABELS[code] || titleCaseStatus(status),
    tone,
  };
}

export default { getStatusDisplay };
