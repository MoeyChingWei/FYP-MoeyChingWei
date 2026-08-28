/**
 * Keep ISO currency codes (for example, MYR) in records and APIs, while using
 * the familiar local symbol in the interface.
 */
export function displayCurrency(currency?: string): string {
  const value = String(currency ?? "").trim();
  return value.toUpperCase() === "MYR" ? "RM" : value || "RM";
}

export function formatCurrency(currency: string | undefined, amount: number): string {
  return `${displayCurrency(currency)} ${Number(amount || 0).toFixed(2)}`;
}
