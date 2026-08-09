export interface SupplierInventoryItem {
  id: string;
  supplierId: number;
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  unitPrice: number;
  location: string;
  updatedAt: string;
}

const STORAGE_PREFIX = "erp_supplier_inventory_v1";

function storageKey(supplierId: number): string {
  return `${STORAGE_PREFIX}_${supplierId}`;
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `inventory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadSupplierInventory(supplierId?: number): SupplierInventoryItem[] {
  if (!supplierId) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(supplierId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSupplierInventory(supplierId: number, rows: SupplierInventoryItem[]): void {
  window.localStorage.setItem(storageKey(supplierId), JSON.stringify(rows));
  window.dispatchEvent(new Event("erp-supplier-inventory"));
}

export function createSupplierInventoryItem(
  supplierId: number,
  values: Omit<SupplierInventoryItem, "id" | "supplierId" | "updatedAt">,
): SupplierInventoryItem {
  return {
    ...values,
    id: newId(),
    supplierId,
    updatedAt: new Date().toISOString(),
  };
}
