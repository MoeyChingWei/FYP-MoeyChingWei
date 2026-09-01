import type { NotificationRow } from "../api/notifications";

/** Resolve the destination for notifications created by every workflow. */
export function resolveNotificationRoute(
  row: Pick<NotificationRow, "type" | "refType" | "refId"> & { rawType?: string },
  role?: string | null,
): string {
  const type = String(row.rawType || row.type || "").toUpperCase();
  const refType = String(row.refType || "").toLowerCase();
  const refId = row.refId;

  if ([
    "BUDGET_THRESHOLD_WARNING",
    "BUDGET_EXCEEDED",
    "BUDGET_THRESHOLD_EXCEEDED",
    "BUDGET_PREDICTION_READY",
    "BUDGET_PREDICTION_FAILED",
    "BUDGET_AUTO_GENERATED",
    "BUDGET_SUBMISSION_REMINDER"
  ].includes(type)) {
    return "/budget/department-overview";
  }
  if ([
    "BUDGET_ADJUSTMENT_REQUESTED",
    "BUDGET_ADJUSTMENT_SUBMITTED",
    "BUDGET_ADJUSTMENT_APPROVED",
    "BUDGET_ADJUSTMENT_REJECTED"
  ].includes(type)) {
    return "/budget/adjustment-request";
  }
  if (type === "PURCHASE_REQUEST_APPROVAL" && refId) return `/purchasing/approval/${refId}`;
  if (type === "PURCHASE_ORDER_APPROVAL" && refId) return `/purchasing/po-approval/${refId}`;
  if (type === "SUPPLIER_INVOICE_APPROVAL") return "/finance/invoice-approval";
  if (type === "SUPPLIER_PAYMENT_PENDING") return role === "Supplier" ? "/supplier-overview/payment" : "/finance/payment-processing";
  if (type === "SUPPLIER_PAYMENT_COMPLETED") return role === "Supplier" ? "/supplier-overview/payment" : "/finance/payment-processing";
  if (type === "SUPPLIER_ORDER_ACK" && refId) return `/supplier-overview/order-acknowledgement/${refId}`;

  if (refType === "purchase-request" && refId) return `/purchasing/review/${refId}`;
  if (refType === "purchase-order" && refId) return `/purchasing/po-review/${refId}`;
  if (refType === "supplier-order-ack" && refId) return `/supplier-overview/order-acknowledgement/${refId}`;
  if (refType === "delivery" && refId) return `/supplier-overview/delivery/${refId}`;
  if (refType === "grn" && refId) return `/supplier-overview/grn-status/${refId}`;
  if (refType === "supplier-invoice" && refId) return `/supplier-overview/invoice/${refId}`;
  if (refType === "supplier-payment") return role === "Supplier" ? "/supplier-overview/payment" : "/finance/payment-processing";
  if (refType === "feedback") return "/settings/feedback";
  if (refType === "tracking-item" && refId) return `/tracking-item?requestLocalId=${encodeURIComponent(refId)}`;
  return "/overview";
}
