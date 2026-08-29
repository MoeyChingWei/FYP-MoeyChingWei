const LEGACY_PAYMENT_TERM_LABELS = {
  DUE_ON_RECEIPT: "Due on receipt",
  NET_7: "Within 7 days",
  NET_30: "Within 30 days",
  NET_60: "Within 60 days",
  NET_90: "Within 90 days",
};

export function formatPaymentTerm(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "-";
  return LEGACY_PAYMENT_TERM_LABELS[normalized.toUpperCase()] || normalized;
}
