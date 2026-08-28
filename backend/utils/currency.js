/** Convert stored currency codes to the local label used in user-facing output. */
export function displayCurrency(currency) {
  const value = String(currency ?? "").trim();
  return value.toUpperCase() === "MYR" ? "RM" : value || "RM";
}

export function formatCurrency(value, currency) {
  const amount = Number(value);
  return `${displayCurrency(currency)} ${Number.isFinite(amount)
    ? amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "-"}`;
}
